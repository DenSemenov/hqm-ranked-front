import { Button, Col, Form, InputNumber, Radio, Row, notification } from "antd";
import { requestNotificationPermission } from "firebaseService";
import { useAppDispatch } from "hooks/useAppDispatch";
import { IPlayerNotificationsResponse, NotifyType } from "models/IPlayerNotificationsResponse";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuth } from "stores/auth";
import { addPushToken, getPlayerNotifications, removePushToken, savePlayerNotifications } from "stores/auth/async-actions";

const Notifications = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);

    const [notificationsSettings, setNotificationsSettings] = useState<IPlayerNotificationsResponse | undefined>(undefined);
    const [currentToken, setCurrentToken] = useState<string>("");

    useEffect(() => {
        if (!isAuth) {
            navigate("/")
        } else {
            getSettings();
        }
    }, [!isAuth])

    const getSettings = () => {
        dispatch(getPlayerNotifications()).unwrap().then((data: IPlayerNotificationsResponse) => {
            const token = localStorage.getItem("pushToken");
            if (token) {
                setCurrentToken(token);
            }
            setNotificationsSettings(data);
        })
    }


    const onSaveNotifications = (values: any) => {
        dispatch(savePlayerNotifications(values)).unwrap().then(() => {
            getSettings();

            notification.success({
                message: "Notifications settings saved successfully"
            })
        });
    }

    const onEnablePush = async () => {
        if (notificationsSettings) {
            if (currentToken === notificationsSettings.token) {
                const t = localStorage.getItem("pushToken");
                if (t) {
                    dispatch(removePushToken({
                        token: t
                    })).unwrap().then(() => {
                        getSettings();
                    });
                    localStorage.removeItem("pushToken");
                }

                notification.success({
                    message: "Push notifications disabled"
                })
            } else {
                const token = await requestNotificationPermission()
                if (token) {
                    localStorage.setItem("pushToken", token);
                    dispatch(addPushToken({
                        token: token
                    })).unwrap().then(() => {
                        getSettings();
                    });

                    notification.success({
                        message: "Push notifications enabled"
                    })
                }
            }
        }
    }

    return (
        <Row style={{ padding: isMobile ? 16 : 0 }}>
            <Col sm={7} xs={0} />
            <Col sm={10} xs={24}>
                {notificationsSettings &&
                    <Form
                        onFinish={onSaveNotifications}
                        initialValues={notificationsSettings}
                        layout="vertical"
                    >
                        <Form.Item>
                            <Button type="primary" onClick={onEnablePush} >{currentToken === notificationsSettings.token ? "Disable" : "Enable"}</Button>
                        </Form.Item>
                        <Form.Item
                            name="logsCount"
                            label="Notify when equal or more then"
                            rules={[{ required: true, message: 'Please input value' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            name="gameStarted"
                            label="Game starts notification"
                            rules={[{ required: true, message: 'Please pick an item' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value={NotifyType.None}>Disabled</Radio.Button>
                                <Radio.Button value={NotifyType.On}>Enabled</Radio.Button>
                                <Radio.Button value={NotifyType.OnWithMe}>Enabled if logged in</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="gameEnded"
                            label="Game ends notification"
                            rules={[{ required: true, message: 'Please pick an item' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value={NotifyType.None}>Disabled</Radio.Button>
                                <Radio.Button value={NotifyType.On}>Enabled</Radio.Button>
                                <Radio.Button value={NotifyType.OnWithMe}>Enabled if logged in</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Save</Button>
                        </Form.Item>
                    </Form>
                }
            </Col>
        </Row>
    )
}

export default Notifications;