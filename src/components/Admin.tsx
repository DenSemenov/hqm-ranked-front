import { Badge, Button, Card, Checkbox, Col, Form, Input, InputNumber, List, Popconfirm, Popover, Row, Select, Table, Tabs, Tag, Typography, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { LoginInstance } from "models/IAdminPlayerResponse";
import { IInstanceType } from "models/IInstanceType";
import { useEffect, useMemo, useState } from "react";
import { FaInfo } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertDate } from "shared/DateConverter";
import PlayerItem from "shared/PlayerItem";
import { selectAdminStories, selectAdmins, selectPlayers, selectServers, selectSettings, selectUnapprovedUsers } from "stores/admin";
import { addAdminStory, addRemoveAdmin, addServer, approveUser, banUnban, deleteServer, getAdminStories, getAdmins, getPlayers, getServers, getSettings, getUnApprovedUsers, removeAdminStory, saveSettings } from "stores/admin/async-actions";
import { selectIsAdmin } from "stores/auth";
import { WarningOutlined } from "@ant-design/icons"
import _ from "lodash";

const { TextArea } = Input;
const { Search } = Input;
const { Text, Title } = Typography;

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

    const [search, setSearch] = useState("");

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

    const onAddServer = (instanceType: IInstanceType) => {
        dispatch(addServer({
            name: "Not connected",
            instanceType: instanceType

        })).unwrap().then(() => {
            dispatch(getServers())
        })
    }

    const onBanUnban = (id: number, banned: boolean, count: number) => {
        dispatch(banUnban({
            id: id,
            isBanned: !banned,
            days: count
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

            pagination={false}
            rowKey={"id"}
            footer={() => <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={() => onAddServer(IInstanceType.Ranked)}>Add ranked server</Button>
                <Button onClick={() => onAddServer(IInstanceType.Teams)}>Add teams server</Button>
                <Button onClick={() => onAddServer(IInstanceType.WeeklyTourney)}>Add weekly tourney server</Button>
            </div>}
            columns={[
                {
                    title: "Name",
                    dataIndex: "name",
                },
                {
                    title: "Type",
                    dataIndex: "instanceType",
                    render(value, record, index) {
                        if (value === 0) {
                            return <Tag>Ranked</Tag>
                        }
                        if (value === 1) {
                            return <Tag>Teams</Tag>
                        }
                        if (value === 2) {
                            return <Tag>Weekly tourney</Tag>
                        }
                    },
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

    const filtered = useMemo(() => {
        return players.filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, players])

    const getFlagEmoji = (countryCode: string) => {
        let codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    const getLoginInstanceType = (type: LoginInstance) => {
        switch (type) {
            case LoginInstance.Server:
                return "Server"
            case LoginInstance.Web:
                return "Web"
        }
    }

    const duplications = useMemo(() => {
        const duplicatedIPs: {
            logins: {
                id: number,
                name: string
            }[],
            ip: string
        }[] = [];
        const allIps = _.uniq(players.flatMap(x => x.logins).map(x => x.ip));
        allIps.filter(x => x !== "").forEach(ip => {
            const playersWithThisIp = players.filter(x => x.logins.findIndex(y => y.ip === ip) !== -1);
            if (playersWithThisIp.length > 1) {
                duplicatedIPs.push({
                    logins: playersWithThisIp.map(x => {
                        return {
                            id: x.id,
                            name: x.name
                        }
                    }),
                    ip: ip
                })
            }
        });

        return duplicatedIPs;
    }, [players])

    const playersTab = useMemo(() => {
        return <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
            <Col span={24}>
                <div style={{ display: "flex", gap: 8 }}>
                    <Search
                        placeholder="Search"
                        allowClear
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={(value) => setSearch(value)}
                    />
                    <Popover
                        trigger={"click"}
                        title="Duplications"
                        style={{ width: 400 }}
                        placement="leftBottom"
                        content={<List
                            dataSource={duplications}
                            renderItem={(item, index) => (
                                <List.Item style={{ display: "flex", gap: 8 }}>
                                    <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                                        {item.logins.map(login => {
                                            return <PlayerItem id={login.id} name={login.name} />
                                        })}
                                    </div>
                                    <Tag>{item.ip}</Tag>
                                </List.Item>
                            )}
                        />}
                    >
                        <Badge count={duplications.length}>
                            <Button icon={<WarningOutlined />} />
                        </Badge>
                    </Popover>
                </div>
            </Col>
            <Col span={24}>
                <Table
                    dataSource={filtered}

                    rowKey={"id"}
                    columns={[
                        {
                            title: "Id",
                            dataIndex: "id",
                            width: 100
                        },
                        {
                            title: "Name",
                            dataIndex: "name",
                            render(value, record, index) {
                                return <PlayerItem id={record.id} name={record.name} />
                            }
                        },
                        {
                            title: "Logins",
                            dataIndex: "login",
                            render(value, record, index) {
                                if (record.logins.length !== 0) {
                                    const lastLogin = record.logins[0];
                                    return <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span>{getFlagEmoji(lastLogin.countryCode)}</span>
                                        <Tag>{lastLogin.city}</Tag>
                                        <Popover
                                            trigger={"click"}
                                            title="Player logins"
                                            content={<Table
                                                style={{ width: 500 }}
                                                scroll={{ y: 400 }}
                                                rowKey={"date"}
                                                dataSource={record.logins}
                                                columns={[
                                                    {
                                                        title: "Location",
                                                        dataIndex: "location",
                                                        render(value, record, index) {
                                                            return <>
                                                                <span style={{ marginRight: 8 }}>{getFlagEmoji(record.countryCode)}</span>
                                                                <Tag>{record.city}</Tag>
                                                            </>
                                                        },
                                                    },
                                                    {
                                                        title: "Instance",
                                                        dataIndex: "instance",
                                                        render(value, record, index) {
                                                            return getLoginInstanceType(record.loginInstance)
                                                        },
                                                    },
                                                    {
                                                        title: "IP",
                                                        dataIndex: "ip",
                                                    },
                                                    {
                                                        title: "Date",
                                                        dataIndex: "date",
                                                        render(value, record, index) {
                                                            return convertDate(record.date)
                                                        },
                                                    },
                                                ]}
                                            />}
                                        >
                                            <Button size={"small"} type="text" icon={<FaInfo />} />
                                        </Popover>
                                    </div>
                                } else {
                                    return <div />
                                }

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
            </Col>
        </Row>
    }, [filtered, duplications])

    const adminsTab = useMemo(() => {
        return <Table
            dataSource={admins}

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
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
                <Card title="Main" >
                    <div style={{ padding: 16 }}>
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
                    </div>
                </Card>
                <Card title="Discord" >
                    <div style={{ padding: 16 }}>
                        <Form.Item
                            label="Discord connect required"
                            name="discordApprove"
                            valuePropName="checked"
                        >
                            <Checkbox />
                        </Form.Item>
                        <Form.Item
                            label="Discord join link"
                            name="discordJoinLink"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Discord notifications webhook"
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
                            label="Discord ClientId"
                            tooltip={"For Discord auth"}
                            name="discordAppClientId"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Discord news webhook"
                            tooltip={"For achievements, nickname changes, and teams notifications"}
                            name="discordNewsWebhook"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Discord ClientId"
                            tooltip={"For Discord auth"}
                            name="discordAppClientId"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Web url"
                            name="webUrl"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                </Card>
                <Card title="Teams" >
                    <div style={{ padding: 16 }}>
                        <Form.Item
                            label="Team max players"
                            name="teamsMaxPlayer"
                            tooltip={"Uses in Teams"}
                        >
                            <InputNumber />
                        </Form.Item>
                    </div>
                </Card>
                <Card title="Spotify" >
                    <div style={{ padding: 16 }}>
                        <Form.Item
                            label="Spotify clientId"
                            name="spotifyClientId"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Spotify secret"
                            name="spotifySecret"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Spotify playlist"
                            name="spotifyPlaylist"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                </Card>
                <Card title="S3" >
                    <div style={{ padding: 16 }}>
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
                    </div>
                </Card>
                <Form.Item >
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
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