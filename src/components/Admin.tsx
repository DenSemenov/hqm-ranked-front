import { Button, Form, InputNumber, Popconfirm, Popover, Select, Table, Tabs } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PlayerItem from "shared/PlayerItem";
import { selectAdmins, selectPlayers, selectServers } from "stores/admin";
import { addRemoveAdmin, addServer, banUnban, deleteServer, getAdmins, getPlayers, getServers } from "stores/admin/async-actions";
import { selectIsAdmin } from "stores/auth";

const Admin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAdmin = useSelector(selectIsAdmin);
    const servers = useSelector(selectServers);
    const players = useSelector(selectPlayers);
    const admins = useSelector(selectAdmins);

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        } else {
            dispatch(getServers())
            dispatch(getPlayers())
            dispatch(getAdmins())
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
                }
            ]}
        />
    )
}

export default Admin;