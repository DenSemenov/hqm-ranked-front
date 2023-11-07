import { Button, Form, Input, Modal, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { changePassword } from "stores/auth/async-actions";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: IProps) => {
    const dispatch = useAppDispatch();

    const onChange = (values: any) => {
        console.log(values);
        dispatch(changePassword({
            password: values.password,
        })).unwrap().then(() => {
            notification.success({
                message: "Password successfully changed"
            })
            onClose();
        })
    }

    return (
        <Modal open={open} onCancel={onClose} footer={[]}>
            <Form
                onFinish={onChange}
                layout="vertical"
            >
                <Form.Item name="password" >
                    <Input size="large" type="password" placeholder="NEW PASSWORD" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">SAVE</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangePasswordModal;