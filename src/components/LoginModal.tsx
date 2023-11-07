import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import styles from './LoginModal.module.css'
import { login } from "stores/auth/async-actions";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const LoginModal = ({ open, onClose }: IProps) => {
    const dispatch = useAppDispatch();

    const onLogin = (values: any) => {
        dispatch(login({
            login: values.login,
            password: values.password,
        }))
    }

    return (
        <Modal open={open} onCancel={onClose} footer={[]}>
            <Row>
                <Col span={24}>
                    <div className={styles.loginModalCenter}>
                        <span>
                            <svg height="88" width="88">
                                <image href="/icons/logo.svg" height="88" width="88" />
                            </svg>
                        </span>
                        <div>
                            HQM
                            <br />
                            RANKED
                        </div>
                    </div>
                </Col>
                <Col span={24}>
                    <div className={styles.loginModalCenter}>
                        <h1>LOGIN</h1>
                    </div>
                </Col>
                <Col span={24}>
                    <Form
                        onFinish={onLogin}
                        layout="vertical"
                    >
                        <Form.Item name="login" >
                            <Input size="large" placeholder="NICKNAME" />
                        </Form.Item>
                        <Form.Item name="password">
                            <Input size="large" type="password" placeholder="PASSWORD" />
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Button type="dashed" >REGISTRATION</Button>
                            </Col>
                            <Col span={12} className="right-align">
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">SIGN IN</Button>
                                </Form.Item>
                            </Col>
                        </Row>


                    </Form>
                </Col>
            </Row>
        </Modal>
    )
}

export default LoginModal;