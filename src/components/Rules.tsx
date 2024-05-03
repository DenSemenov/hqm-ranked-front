import { Modal, Typography } from "antd";
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
            <div dangerouslySetInnerHTML={{ __html: rules }} />
        </Modal>
    )
}

export default Rules;