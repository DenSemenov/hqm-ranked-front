import { useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'
import { Avatar, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectStorageUrl } from 'stores/season';
import { selectCurrentUser } from 'stores/auth';

export enum PlayerItemType {
    Both,
    Avatar,
    Name
}

interface IProps {
    id: number;
    key?: number;
    name: string;
    type?: PlayerItemType,
}

const PlayerItem = ({ id, name, key = 0, type = PlayerItemType.Both }: IProps) => {
    const navigate = useNavigate();

    const storageUrl = useSelector(selectStorageUrl);
    const currentUser = useSelector(selectCurrentUser);

    const avatarName = useMemo(() => {
        return name[0].toUpperCase()
    }, [name])

    const isCurrent = useMemo(() => {
        return currentUser ? currentUser.id === id : false
    }, [id, currentUser])

    return (
        <div
            className={styles.playerItem + " " + (isCurrent ? styles.currentUserTextStyle : undefined)}
            key={key}
            onClick={() => navigate("/player?id=" + id)}
        >
            {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                <Tooltip title={type === PlayerItemType.Avatar ? name : undefined}>
                    <Avatar className={isCurrent ? styles.currentUserStyle : undefined} shape='square' src={storageUrl + "images/" + id + ".png"}>{avatarName}</Avatar>
                </Tooltip>
            }
            {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                name
            }
        </div>
    )
}

export default PlayerItem;