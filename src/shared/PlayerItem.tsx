import { Link, useNavigate } from 'react-router-dom';
import styles from './PlayerItem.module.css'
import { Avatar, Col, Popover, Row, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectClearImageCache, selectCurrentPlayerLiteData, selectStorageUrl } from 'stores/season';
import { selectCurrentUser, selectTheme } from 'stores/auth';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { getPlayerLiteData } from 'stores/season/async-actions';
import Chart from 'react-apexcharts';

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

    const [infoVisible, setInfoVisible] = useState<boolean>(false);

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

    const onGetLiteData = () => {
        dispatch(getPlayerLiteData({
            id: id
        })).unwrap().then(() => {
            setInfoVisible(true)
        })
    }

    return (
        <Link to={"/player?id=" + id}>
            <Popover
                showArrow={false}
                arrow={false}
                placement='bottomRight'
                open={infoVisible && playerLiteData?.id === id}
                content={playerLiteData != null ? <div className={styles.liteData}>
                    <Avatar
                        style={{ border: bordered ? "2px solid black" : undefined }}
                        size={68}
                        shape='square'
                        src={storageUrl + "images/" + id + ".png" + "?t=" + query}
                    >
                        {avatarName}
                    </Avatar>
                    <Row style={{ minWidth: 200 }}>
                        <Col span={24}>
                            <Title level={5}>{playerLiteData.name}</Title>
                        </Col>
                        <Col span={8} style={{ display: "flex", gap: 4 }}>
                            <Text type="secondary">GP</Text>
                            <Text >{playerLiteData.gp}</Text>
                        </Col>
                        <Col span={8} style={{ display: "flex", gap: 4 }}>
                            <Text type="secondary">G</Text>
                            <Text >{playerLiteData.goals}</Text>
                        </Col>
                        <Col span={8} style={{ display: "flex", gap: 4 }}>
                            <Text type="secondary">A</Text>
                            <Text >{playerLiteData.assists}</Text>
                        </Col>
                    </Row>
                </div> : undefined}
            >
                <div
                    onMouseEnter={onGetLiteData}
                    onMouseLeave={() => setInfoVisible(false)}
                    className={styles.playerItem + " " + (isCurrent ? styles.currentUserTextStyle : undefined)}
                    key={key}
                >
                    {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                        <Avatar
                            style={{ border: bordered ? "2px solid black" : undefined }}
                            size={size}
                            className={isCurrent ? styles.currentUserStyle : undefined}
                            shape='circle'
                            src={storageUrl + "images/" + id + ".png" + "?t=" + query}
                        >
                            {avatarName}
                        </Avatar>
                    }
                    {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                        name
                    }
                </div>
            </Popover>
        </Link>
    )
}

export default PlayerItem;