import { Link, useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'
import { Avatar, Col, Popover, Row, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClearImageCache, selectCurrentPlayerLiteData, selectStorageUrl } from 'stores/season';
import { selectCurrentUser, selectTheme, setHoveredPosition } from 'stores/auth';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { getPlayerLiteData } from 'stores/season/async-actions';
import HoveredPlayerItem from './HoveredPlayerItem';

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

const { Text, Title } = Typography;

const PlayerItem = ({ id, name, key = 0, type = PlayerItemType.Both, size, bordered = false }: IProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const storageUrl = useSelector(selectStorageUrl);
    const currentUser = useSelector(selectCurrentUser);
    const clearImageCache = useSelector(selectClearImageCache);
    const playerLiteData = useSelector(selectCurrentPlayerLiteData);
    const theme = useSelector(selectTheme);

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

    const onGetLiteData = (e: any) => {
        dispatch(getPlayerLiteData({
            id: id
        }))
    }

    return (
        <Link to={"/player?id=" + id} >
            <Tooltip arrow={false} overlayInnerStyle={{ background: "transparent" }} placement="topRight" title={<HoveredPlayerItem />}>
                <div
                    className={styles.playerItem + " " + (isCurrent ? styles.currentUserTextStyle : undefined)}
                    key={key}
                    onMouseOver={onGetLiteData}
                >
                    {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                        <Avatar
                            style={{ border: bordered ? "2px solid black" : undefined }}
                            size={size}
                            className={(isCurrent ? styles.currentUserStyle : "")}
                            shape='circle'
                            src={storageUrl + "images/" + id + ".png" + "?t=" + query}
                            rootClassName='player-item'
                        >
                            {avatarName}
                        </Avatar>
                    }
                    {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                        name
                    }
                </div>
            </Tooltip>
        </Link>
    )
}

export default PlayerItem;