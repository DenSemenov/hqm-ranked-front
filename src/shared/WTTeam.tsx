import { Tooltip, Avatar } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "stores/auth";
import { selectStorageUrl, selectClearImageCache } from "stores/season";
import { selectTeamsState } from "stores/teams";
import styles from './PlayerItem.module.css'

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

const WTTeam = ({ id, name, key = 0, type = PlayerItemType.Both }: IProps) => {

    const storageUrl = useSelector(selectStorageUrl);
    const clearImageCache = useSelector(selectClearImageCache);
    const currentUser = useSelector(selectCurrentUser);

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
        >
            {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                <Tooltip title={type === PlayerItemType.Avatar ? name : undefined}>
                    <Avatar style={{ borderRadius: 8 }} shape='square' src={storageUrl + "images/" + id + ".png" + "?t=" + query}>{avatarName}</Avatar>
                </Tooltip>
            }
            {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                name
            }
        </div>
    )
}

export default WTTeam;