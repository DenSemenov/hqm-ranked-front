import { Modal } from "antd";
import PlayersTable from "./PlayersTable";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const PlayersTableModal = ({ open, onClose }: IProps) => {
    return (
        <Modal open={open} onCancel={onClose} footer={[]} width={1000}>
            <PlayersTable full={true} />
        </Modal>
    )
}

export default PlayersTableModal;