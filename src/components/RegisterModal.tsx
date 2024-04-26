import { Modal, Row, Col, Input, Button, Form } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { login, register } from "stores/auth/async-actions";
import styles from './RegisterModal.module.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuth } from "stores/auth";


const RegisterModal = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        if (isAuth) {
            navigate("/")
        }
    }, [isAuth])

    const onRegister = (values: any) => {
        dispatch(register({
            login: values.login,
            email: values.email,
            password: values.password,
        }))
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
                    <h1>REGISTRATION</h1>
                </div>
                <Form
                    onFinish={onRegister}
                    layout="vertical"
                >
                    <Form.Item name="login" rules={[{ required: true }]}>
                        <Input placeholder="Nickname" />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true }]}>
                        <Input type="password" placeholder="Password" />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Button type="dashed" onClick={() => navigate("/login")}>Sign in</Button>
                        </Col>
                        <Col span={12} className="right-align">
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Registration</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    )
}

export default RegisterModal;