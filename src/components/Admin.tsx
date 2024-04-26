import { Button, Popconfirm, Table, Tabs } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectServers } from "stores/admin";
import { addServer, deleteServer, getServers } from "stores/admin/async-actions";
import { selectIsAdmin } from "stores/auth";

const Admin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAdmin = useSelector(selectIsAdmin);
    const servers = useSelector(selectServers);

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        } else {
            dispatch(getServers())
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

    return (
        <Tabs
            type="card"
            items={[
                {
                    label: "Servers",
                    key: "Servers",
                    children: serversTab
                }
            ]}
        />
    )
}

export default Admin;