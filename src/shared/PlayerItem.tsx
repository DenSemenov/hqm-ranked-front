import { useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'
import { Avatar, Tooltip } from 'antd';
import { useMemo } from 'react';

export enum PlayerItemType {
    Both,
    Avatar,
    Name
}

interface IProps {
    id: number;
    name: string;
    type?: PlayerItemType,
}

const PlayerItem = ({ id, name, type = PlayerItemType.Both }: IProps) => {
    const navigate = useNavigate();

    const avatarName = useMemo(() => {
        return name[0].toUpperCase()
    }, [name])

    return (
        <div
            className={styles.playerItem}
            onClick={() => navigate("/player?id=" + id)}
        >
            {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                <Tooltip title={name}>
                    <Avatar>{avatarName}</Avatar>
                </Tooltip>
            }
            {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                name
            }
        </div>
    )
}

export default PlayerItem;