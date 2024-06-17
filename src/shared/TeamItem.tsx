import { useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'
import { Avatar, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectClearImageCache, selectStorageUrl } from 'stores/season';
import { selectCurrentUser } from 'stores/auth';

export enum PlayerItemType {
    Both,
    Avatar,
    Name
}

interface IProps {
    id: string;
    key?: number;
    name: string;
    type?: PlayerItemType,
}

const TeamItem = ({ id, name, key = 0, type = PlayerItemType.Both }: IProps) => {
    const navigate = useNavigate();

    const storageUrl = useSelector(selectStorageUrl);
    const clearImageCache = useSelector(selectClearImageCache);

    const avatarName = useMemo(() => {
        return name[0].toUpperCase()
    }, [name])

    const query = useMemo(() => {
        if (clearImageCache) {
            return clearImageCache.getTime();
        }
    }, [clearImageCache])

    return (
        <div
            className={styles.playerItem}
            key={key}
            onClick={() => navigate("/team?id=" + id)}
        >
            {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                <Tooltip title={type === PlayerItemType.Avatar ? name : undefined}>
                    <Avatar shape='square' src={storageUrl + "images/" + id + ".png" + "?t=" + query}>{avatarName}</Avatar>
                </Tooltip>
            }
            {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                name
            }
        </div>
    )
}

export default TeamItem;