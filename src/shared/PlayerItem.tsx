import { Link, useNavigate } from 'react-router-dom';
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
    id: number;
    key?: number;
    name: string;
    type?: PlayerItemType,
    size?: number
    bordered?: boolean
}

const PlayerItem = ({ id, name, key = 0, type = PlayerItemType.Both, size, bordered = false }: IProps) => {
    const navigate = useNavigate();

    const storageUrl = useSelector(selectStorageUrl);
    const currentUser = useSelector(selectCurrentUser);
    const clearImageCache = useSelector(selectClearImageCache);

    const avatarName = useMemo(() => {
        return name[0].toUpperCase()
    }, [name])

    const isCurrent = useMemo(() => {
        return currentUser ? currentUser.id === id : false
    }, [id, currentUser])

    const query = useMemo(() => {
        if (clearImageCache) {
            return clearImageCache.getTime();
        }
    }, [clearImageCache])

    return (
        <Link to={"/player?id=" + id}>
            <div
                className={styles.playerItem + " " + (isCurrent ? styles.currentUserTextStyle : undefined)}
                key={key}
            >
                {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                    <Tooltip zIndex={10001} title={type === PlayerItemType.Avatar ? name : undefined}>
                        <Avatar
                            style={{ border: bordered ? "2px solid black" : undefined }}
                            size={size}
                            className={isCurrent ? styles.currentUserStyle : undefined}
                            shape='circle'
                            src={storageUrl + "images/" + id + ".png" + "?t=" + query}
                        >
                            {avatarName}
                        </Avatar>
                    </Tooltip>
                }
                {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                    name
                }
            </div>
        </Link>
    )
}

export default PlayerItem;