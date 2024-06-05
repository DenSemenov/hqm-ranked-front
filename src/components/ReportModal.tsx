import { Modal, Select, Form, Button, Typography, Tooltip, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentGameData, selectRules } from "stores/season";
import { getGameData, getRules, report } from "stores/season/async-actions";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface IProps {
    open: boolean;
    gameId: string;
    tick: number;
    onClose: () => void;
}

const ReportModal = ({ open, gameId, tick, onClose }: IProps) => {
    const dispatch = useAppDispatch();

    const rules = useSelector(selectRules);
    const currentGameData = useSelector(selectCurrentGameData);

    useEffect(() => {
        dispatch(getRules());
        dispatch(getGameData({
            id: gameId
        }));
    }, []);

    const onSendReport = (values: any) => {
        dispatch(report({
            id: values.player,
            reasonId: values.reason,
            tick: tick,
            gameId: gameId
        }))
            .unwrap()
            .then((result: string) => {
                if (result) {
                    notification.error({
                        message: result
                    })
                } else {
                    notification.info({
                        message: "Report successfully sent"
                    })
                }
                onClose();
            });
    }

    return (
        <Modal title={"Send report"} open={open} onCancel={onClose} footer={[]} width={600}>
            <Form
                onFinish={onSendReport}
                layout="vertical"
            >
                {currentGameData &&
                    <Form.Item label="Player" name="player" rules={[{ required: true }]}>
                        <Select
                            options={currentGameData.players.map(pl => {
                                return {
                                    label: pl.name,
                                    value: pl.id,
                                }
                            })}
                        />
                    </Form.Item>
                }
                <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
                    <Select
                        options={rules.rules.map(pl => {
                            return {
                                label: <div>
                                    <Text>{pl.title}</Text> <Tooltip title={pl.description}><InfoCircleOutlined /></Tooltip>
                                </div>,
                                value: pl.id,
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">Send report</Button>
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default ReportModal;