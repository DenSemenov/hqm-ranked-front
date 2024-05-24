import { Card, Modal, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRules } from "stores/season";
import { getRules } from "stores/season/async-actions";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const Rules = ({ open, onClose }: IProps) => {
    const dispatch = useAppDispatch();

    const rules = useSelector(selectRules);

    useEffect(() => {
        dispatch(getRules());
    }, []);

    return (
        <Modal title={"Rules"} open={open} onCancel={onClose} footer={[]} width={1000}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {rules.rules.map(rule => {
                    return <Card title={rule.title} >
                        <div style={{ padding: 16 }}>{rule.description}</div>
                    </Card>
                })}
                <div dangerouslySetInnerHTML={{ __html: rules.text }} />
            </div>
        </Modal>
    )
}

export default Rules;