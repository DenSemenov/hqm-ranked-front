import { Button, Checkbox, Form, Input, InputNumber, Popconfirm, Popover, Select, Table, Tabs, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertDate } from "shared/DateConverter";
import PlayerItem from "shared/PlayerItem";
import { selectAdminStories, selectAdmins, selectPlayers, selectServers, selectSettings, selectUnapprovedUsers } from "stores/admin";
import { addAdminStory, addRemoveAdmin, addServer, approveUser, banUnban, deleteServer, getAdminStories, getAdmins, getPlayers, getServers, getSettings, getUnApprovedUsers, removeAdminStory, saveSettings } from "stores/admin/async-actions";
import { selectIsAdmin } from "stores/auth";

const { TextArea } = Input;

const Admin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAdmin = useSelector(selectIsAdmin);
    const servers = useSelector(selectServers);
    const players = useSelector(selectPlayers);
    const admins = useSelector(selectAdmins);
    const settings = useSelector(selectSettings);
    const unapprovedUsers = useSelector(selectUnapprovedUsers);
    const adminStories = useSelector(selectAdminStories);

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        } else {
            dispatch(getServers())
            dispatch(getPlayers())
            dispatch(getAdmins())
            dispatch(getSettings())
            dispatch(getUnApprovedUsers())
            dispatch(getAdminStories())
        }
    }, [isAdmin])

    const onDeleteServer = (id: string) => {
        dispatch(deleteServer({
            id: id
        })).unwrap().then(() => {
            dispatch(getServers())
        })
    }

    const onAddServer = () => {
        dispatch(addServer({
            name: "Not connected"
        })).unwrap().then(() => {
            dispatch(getServers())
        })
    }

    const onBanUnban = (id: number, banned: boolean, count: number) => {
        dispatch(banUnban({
            id: id,
            isBanned: !banned,
            days: 7
        })).unwrap().then(() => {
            dispatch(getPlayers())
        })
    }

    const onAddRemoveAdmin = (id: number) => {
        dispatch(addRemoveAdmin({
            id: id
        })).unwrap().then(() => {
            dispatch(getAdmins())
        })
    }

    const serversTab = useMemo(() => {
        return <Table
            dataSource={servers}
            bordered={false}
            pagination={false}
            rowKey={"id"}
            footer={() => <Button onClick={onAddServer}>Add server</Button>}
            columns={[
                {
                    title: "Name",
                    dataIndex: "name"
                },
                {
                    title: "Token",
                    dataIndex: "token"
                },
                {
                    title: "",
                    align: "right",
                    dataIndex: "action",
                    render(value, record, index) {
                        return <Popconfirm
                            title="Delete server"
                            description="Are you sure to delete this server?"
                            onConfirm={() => onDeleteServer(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    },
                },
            ]}
        />
    }, [servers])

    const playersTab = useMemo(() => {
        return <Table
            dataSource={players}
            bordered={false}
            pagination={false}
            rowKey={"id"}
            columns={[
                {
                    title: "Id",
                    dataIndex: "id"
                },
                {
                    title: "Name",
                    dataIndex: "name",
                    render(value, record, index) {
                        return <PlayerItem id={record.id} name={record.name} />
                    }
                },
                {
                    title: "",
                    align: "right",
                    dataIndex: "action",
                    render(value, record, index) {
                        if (!record.isBanned) {
                            return <Popover
                                title="Ban player"
                                content={
                                    <Form
                                        onFinish={(values) => onBanUnban(record.id, record.isBanned, values.count)}
                                    >
                                        <Form.Item
                                            label="Days count"
                                            name="count"
                                        >
                                            <InputNumber />
                                        </Form.Item>

                                        <Form.Item >
                                            <Button type="primary" htmlType="submit">
                                                Ban
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                }
                                trigger={"click"}
                            >
                                <Button >Ban</Button>
                            </Popover>
                        } else {
                            return <Button danger onClick={() => onBanUnban(record.id, record.isBanned, 0)}>Unban</Button>
                        }
                    },
                },
            ]}
        />
    }, [players])

    const adminsTab = useMemo(() => {
        return <Table
            dataSource={admins}
            bordered={false}
            pagination={false}
            footer={() => <Popover
                title="Ban player"
                content={
                    <Form
                        onFinish={(values) => onAddRemoveAdmin(values.user)}
                    >
                        <Form.Item
                            label="User"
                            name="user"
                        >
                            <Select
                                options={players.map(x => {
                                    return {
                                        value: x.id,
                                        label: x.name
                                    }
                                })}
                            />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Add admin
                            </Button>
                        </Form.Item>
                    </Form>
                }
                trigger={"click"}
            >
                <Button >Add admin</Button>
            </Popover>}
            rowKey={"id"}
            columns={[
                {
                    title: "Id",
                    dataIndex: "id"
                },
                {
                    title: "Name",
                    dataIndex: "name",
                    render(value, record, index) {
                        return <PlayerItem id={record.id} name={record.name} />
                    }
                },
                {
                    title: "",
                    align: "right",
                    dataIndex: "action",
                    render(value, record, index) {
                        return <Popconfirm
                            title="Delete admin"
                            description="Are you sure to delete this admin?"
                            onConfirm={() => onAddRemoveAdmin(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    },
                },
            ]}
        />
    }, [admins, players])

    const onSaveSettings = (values: any) => {
        dispatch(saveSettings(values)).unwrap().then(() => {
            dispatch(getSettings())
            notification.info({
                message: "Settings successfully saved"
            })
        })
    }

    const settingsTab = useMemo(() => {
        if (settings) {
            return <Form
                initialValues={settings}
                onFinish={onSaveSettings}
                layout="vertical"
            >
                <Form.Item
                    label="Nickname change days limit"
                    name="nicknameChangeDaysLimit"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="New players approve required"
                    name="newPlayerApproveRequired"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>
                <Form.Item
                    label="Replay store days"
                    name="replayStoreDays"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Discord webhook"
                    name="discordNotificationWebhook"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Logged in notification if more or equal count"
                    name="webhookCount"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Next game check games count"
                    name="nextGameCheckGames"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Required shadow ban reports count"
                    name="shadowBanReportsCount"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Starting elo"
                    name="startingElo"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Rules"
                    name="rules"
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="S3 Domain"
                    name="s3Domain"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="S3 Bucket"
                    name="s3Bucket"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="S3 User"
                    name="s3User"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="S3 Key"
                    name="s3Key"
                >
                    <Input />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        }
    }, [settings])

    const onRemoveStory = (id: string) => {
        dispatch(removeAdminStory({
            id: id
        })).unwrap().then(() => {
            dispatch(getAdminStories())
        })
    }

    const onAddStory = (values: any) => {
        dispatch(addAdminStory(values)).unwrap().then(() => {
            dispatch(getAdminStories())
        })
    }

    const storiesTab = useMemo(() => {
        return <Table
            dataSource={adminStories}
            bordered={false}
            pagination={false}
            rowKey={"id"}
            footer={() => <Popover
                title="Add story"
                content={
                    <Form
                        style={{ width: 400 }}
                        layout="vertical"
                        onFinish={(values) => onAddStory(values)}
                    >
                        <Form.Item
                            label="Text"
                            name="text"
                        >
                            <Input.TextArea rows={5} />
                        </Form.Item>
                        <Form.Item
                            label="Link"
                            name="link"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Expiration (hide after one day)"
                            name="expiration"
                            valuePropName="checked"
                        >
                            <Checkbox />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Add story
                            </Button>
                        </Form.Item>
                    </Form>
                }
                trigger={"click"}
            >
                <Button >Add story</Button>
            </Popover>}
            columns={[
                {
                    title: "Text",
                    dataIndex: "text",
                },
                {
                    title: "Expiration",
                    dataIndex: "expiration",
                    render(value, record, index) {
                        return <Checkbox checked={value} disabled />
                    },
                },
                {
                    title: "Date",
                    dataIndex: "date",
                    render(value, record, index) {
                        return convertDate(value);
                    },
                },
                {
                    title: "",
                    align: "right",
                    dataIndex: "action",
                    render(value, record, index) {
                        return <Button onClick={() => onRemoveStory(record.id)}>Remove</Button>
                    },
                },
            ]}
        />
    }, [adminStories])

    const onApprovePlayer = (id: number) => {
        dispatch(approveUser({
            id: id
        })).unwrap().then(() => {
            dispatch(getUnApprovedUsers())
        })
    }

    const unapprovedUsersTab = useMemo(() => {
        return <Table
            dataSource={unapprovedUsers}
            bordered={false}
            pagination={false}
            rowKey={"id"}
            columns={[
                {
                    title: "Id",
                    dataIndex: "id"
                },
                {
                    title: "Name",
                    dataIndex: "name",
                    render(value, record, index) {
                        return <PlayerItem id={record.id} name={record.name} />
                    }
                },
                {
                    title: "",
                    align: "right",
                    dataIndex: "action",
                    render(value, record, index) {
                        return <Button onClick={() => onApprovePlayer(record.id)}>Approve player</Button>
                    },
                },
            ]}
        />
    }, [unapprovedUsers])

    return (
        <Tabs
            type="card"
            items={[
                {
                    label: "Servers",
                    key: "Servers",
                    children: serversTab
                },
                {
                    label: "Players",
                    key: "Players",
                    children: playersTab
                },
                {
                    label: "Admins",
                    key: "Admins",
                    children: adminsTab
                },
                {
                    label: "Unapproved users",
                    key: "UnapprovedUsers",
                    children: unapprovedUsersTab
                },
                {
                    label: "Stories",
                    key: "Stories",
                    children: storiesTab
                },
                {
                    label: "Settings",
                    key: "Settings",
                    children: settingsTab
                },
            ]}
        />
    )
}

export default Admin;