import { Button, Form, Input, Modal, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { changeNickname, changePassword } from "stores/auth/async-actions";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const ChangeNicknameModal = ({ open, onClose }: IProps) => {
    const dispatch = useAppDispatch();

    const onChange = (values: any) => {
        dispatch(changeNickname({
            name: values.login,
        })).unwrap().then((data: string) => {
            notification.info({
                message: data
            })
            onClose();
        })
    }

    return (
        <Modal
            title="Change nickname"
            open={open}
            onCancel={onClose}
            footer={[]}
        >
            <Form
                onFinish={onChange}
                layout="vertical"
            >
                <Form.Item name="login" >
                    <Input placeholder="New nickname" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangeNicknameModal;