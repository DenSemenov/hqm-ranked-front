import { Link, useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'
import { Avatar, Col, Popover, Row, Tooltip, Typography } from 'antd';
import { CSSProperties, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClearImageCache, selectCurrentPlayerLiteData, selectStorageUrl } from 'stores/season';
import { selectCurrentUser, selectTheme, setHoveredPosition } from 'stores/auth';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { getPlayerLiteData } from 'stores/season/async-actions';
import HoveredPlayerItem from './HoveredPlayerItem';
import { RxAvatar } from 'react-icons/rx';
import { ShopItemGroup, ShopItemType } from 'models/IShopItemResponse';
import { selectShopSelects } from 'stores/shop';

export enum PlayerItemType {
    Both,
    Avatar,
    Name
}

interface IProps {
    id?: number;
    key?: number;
    name?: string;
    type?: PlayerItemType,
    size?: number
    bordered?: boolean
    style?: CSSProperties
}

const { Text, Title } = Typography;

const PlayerItem = ({ id, name, key = 0, type = PlayerItemType.Both, size, bordered = false, style = {} }: IProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const storageUrl = useSelector(selectStorageUrl);
    const currentUser = useSelector(selectCurrentUser);
    const clearImageCache = useSelector(selectClearImageCache);
    const shopSelects = useSelector(selectShopSelects);

    const avatarName = useMemo(() => {
        return name ? name[0].toUpperCase() : ""
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
        if (id) {
            dispatch(getPlayerLiteData({
                id: id
            }))
        }
    }

    const getClipPath = () => {
        const item = shopSelects.find(x => x.playerId === id && x.shopItemGroup === ShopItemGroup.AvatarShape)
        if (item) {
            switch (item.shopItemType) {
                case ShopItemType.Hexagon:
                    return "hexagon";
                case ShopItemType.Pacman:
                    return "pacman";
                case ShopItemType.Rhomb:
                    return "rhomb";
                case ShopItemType.Star:
                    return "star";
                case ShopItemType.Square:
                    return "square";
                case ShopItemType.Heart:
                    return "heart";
                default:
                    return "circle";
            }
        } else {
            return "circle";
        }
    }

    const getBorderClass = (previewType: ShopItemType) => {
        if (previewType) {
            switch (previewType) {
                case ShopItemType.Lightning:
                    return "brLightning";
                case ShopItemType.Rain:
                    return "brRain";
                case ShopItemType.Sphere:
                    return "brSphere";
                case ShopItemType.Triangles:
                    return "brTriangles";
                case ShopItemType.CircleFrame:
                    return "brCircle";
                default:
                    return "";
            }
        } else {
            return "";
        }
    }

    const br = useMemo(() => {
        const selected = shopSelects.find(x => x.playerId === id && x.shopItemGroup === ShopItemGroup.Frame)
        if (selected) {
            return getBorderClass(selected.shopItemType)
        } else {
            return ""
        }
    }, [shopSelects])

    const avatar = useMemo(() => {
        const s = size ?? 36;
        const clip = getClipPath();

        const url = storageUrl + "images/" + id + ".png" + "?t=" + query;

        return <div className={styles.border + " " + br} style={{ width: s + 8, height: s + 8, padding: 4, clipPath: "url(#" + clip + "-border)" }} >
            <Avatar
                style={{ width: s, clipPath: "url(#" + clip + ")" }}
                size={s}
                shape="square"
                src={id ? url : "/icons/avatar-template.jpg"}
                rootClassName='player-item'
            >
                {avatarName}
            </Avatar>
        </div>
    }, [size, id, shopSelects])

    return (
        <Link to={"/player?id=" + id} style={style}>
            <Tooltip arrow={false} overlayInnerStyle={{ background: "transparent" }} placement="topRight" title={<HoveredPlayerItem />}>
                <div
                    className={styles.playerItem + " " + (isCurrent ? styles.currentUserTextStyle : undefined)}
                    key={key}
                    onMouseOver={onGetLiteData}
                >
                    {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                        avatar
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