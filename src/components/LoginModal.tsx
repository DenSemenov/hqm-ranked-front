import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import styles from './LoginModal.module.css'
import { login } from "stores/auth/async-actions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuth, selectWebsiteSettings } from "stores/auth";
import { TbBrandDiscord } from "react-icons/tb";


const LoginModal = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const websiteSettings = useSelector(selectWebsiteSettings);

    useEffect(() => {
        if (isAuth) {
            navigate("/")
        }
    }, [isAuth])

    const onLogin = (values: any) => {
        dispatch(login({
            login: values.login,
            password: values.password,
        }))
    }

    const onSignInWithDiscord = () => {
        const redirect = window.origin + "/discordlogin";
        window.location.href = "https://discord.com/api/oauth2/authorize?client_id=" + websiteSettings.discordAppClientId + "&redirect_uri=" + redirect + "&response_type=token&scope=identify";
    }

    return (
        <Row>
            <Col xs={0} sm={8} />
            <Col xs={24} sm={8} style={{ padding: 8 }}>
                <div className={styles.loginModalCenter}>
                    <span>
                        <svg height="200" width="200">
                            <image href="/icons/logo.svg" height="200" width="200" />
                        </svg>
                    </span>
                </div>
                <div className={styles.loginModalCenter}>
                    <h1>LOGIN</h1>
                </div>
                <Form
                    onFinish={onLogin}
                    layout="vertical"
                >
                    <Form.Item name="login" >
                        <Input placeholder="Nickname" />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input type="password" placeholder="Password" />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Button type="dashed" onClick={() => navigate("/registration")}>Registration</Button>
                        </Col>
                        <Col span={12} className="right-align">
                            <div style={{ display: "flex", justifyContent: "right", gap: 8 }}>
                                <Form.Item>
                                    <Button icon={<TbBrandDiscord style={{ marginTop: 2 }} />} onClick={onSignInWithDiscord}>Sign in with Discord</Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Sign in</Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    )
}

export default LoginModal;