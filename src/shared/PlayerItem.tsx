import { useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'

interface IProps {
    id: string;
    name: string;
}

const PlayerItem = (props: IProps) => {
    const navigate = useNavigate();

    return (
        <span className={styles.playerItem} onClick={() => navigate("/player?id=" + props.id)}>
            {props.name}
        </span>
    )
}

export default PlayerItem;