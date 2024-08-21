import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import styles from './PlayersMap.module.css'
import 'leaflet/dist/leaflet.css';
import { isMobile } from 'react-device-detect';
import { useEffect, useMemo, useState } from 'react';
import { getMap } from 'stores/auth/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { selectPlayerMap } from 'stores/auth';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import { selectStorageUrl } from 'stores/season';
import PlayerItem, { PlayerItemType } from 'shared/PlayerItem';
import { Avatar, Badge, Popover } from 'antd';
import { QuestionOutlined } from "@ant-design/icons";
import _ from 'lodash';

const MapComponent = () => {
    const playersMap = useSelector(selectPlayerMap);
    const storageUrl = useSelector(selectStorageUrl);

    const [zoomLevel, setZoomLevel] = useState(3);
    const [drag, setDrag] = useState({});
    const [dragging, setDragging] = useState(false);

    const map = useMap();
    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
            setDragging(false)
        },
        move: () => {
            setDrag(mapEvents.getCenter());
        },
        zoomstart: () => {
            setDragging(true)
        },
    });

    const markers = useMemo(() => {
        if (!dragging) {
            const diff = 3 - zoomLevel * 2;
            const items: {
                lat: number,
                lon: number,
                players: {
                    playerId: number,
                    playerName: string,
                    isHidden: boolean
                }[]
            }[] = [];

            playersMap.forEach(pm => {
                if (items.flatMap(x => x.players).findIndex(y => y.playerId === pm.playerId) === -1) {
                    const item = {
                        lat: pm.lat,
                        lon: pm.lon,
                        players: [
                            {
                                playerId: pm.playerId,
                                playerName: pm.playerName,
                                isHidden: pm.isHidden
                            }
                        ]
                    }

                    playersMap.filter(x => x.playerId !== pm.playerId && items.flatMap(x => x.players).findIndex(y => y.playerId === x.playerId) === -1).forEach(pm2 => {
                        const distance = Math.abs(pm.lat - pm2.lat) + Math.abs(pm.lon - pm2.lon)

                        if (distance < 1) {
                            item.players.push({
                                playerId: pm2.playerId,
                                playerName: pm2.playerName,
                                isHidden: pm2.isHidden
                            })
                        }
                    })

                    items.push(item);
                }
            })

            return items.map(p => {
                const point = map.latLngToContainerPoint({
                    lat: p.lat,
                    lng: p.lon
                })
                return <div className={styles.point} style={{ top: point.y, left: point.x }}>
                    {p.players.length > 1 && zoomLevel < 7 &&
                        <Popover zIndex={10001} content={<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {_.orderBy(p.players, "isHidden").map((pl, index) => {
                                if (pl.isHidden) {
                                    return <Avatar style={{ color: "white", background: "black" }} size={24} shape='circle' ><QuestionOutlined /></Avatar>
                                } else {
                                    return <PlayerItem size={24} id={pl.playerId} name={pl.playerName} bordered />
                                }

                            })}
                        </div>}>
                            {_.orderBy(p.players, "isHidden")[0].isHidden &&
                                <Avatar style={{ color: "white", background: "black" }} size={diff * 24} shape='circle' >{p.players.length}</Avatar>
                            }
                            {!_.orderBy(p.players, "isHidden")[0].isHidden &&
                                <Badge count={"+" + (p.players.length - 1)} style={{ backgroundColor: 'black', color: "white" }}>
                                    <PlayerItem size={diff * 24} id={_.orderBy(p.players, "isHidden")[0].playerId} name={_.orderBy(p.players, "isHidden")[0].playerName} bordered type={PlayerItemType.Avatar} />
                                </Badge>
                            }
                        </Popover>
                    }
                    {p.players.length > 1 && zoomLevel >= 7 &&
                        <div style={{ display: "flex", gap: 8, position: "absolute", justifyContent: "center", alignItems: "center" }}>
                            {p.players.map(pl => {
                                if (pl.isHidden) {
                                    return <Avatar size={diff * 24} icon={<QuestionOutlined />} shape='circle' style={{ color: "white", background: "black" }} />
                                } else {
                                    return <PlayerItem size={diff * 24} id={pl.playerId} name={pl.playerName} type={PlayerItemType.Avatar} bordered />
                                }

                            })}
                        </div>
                    }
                    {p.players.length === 1 &&
                        <>
                            {p.players[0].isHidden &&
                                <Avatar size={diff * 24} shape='circle' style={{ color: "white", background: "black" }} ><QuestionOutlined /></Avatar>
                            }
                            {!p.players[0].isHidden &&
                                <PlayerItem size={diff * 24} id={p.players[0].playerId} name={p.players[0].playerName} type={PlayerItemType.Avatar} bordered />
                            }
                        </>

                    }
                </div>
            })
        } else {
            return <div />
        }
    }, [playersMap, zoomLevel, drag, dragging])

    return <div>{markers}</div>
}

const PlayersMap = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getMap())
    }, [])

    return (
        <MapContainer
            className={isMobile ? styles.viewerContainerMobile : styles.viewerContainer}
            center={[51.505, -0.09]}
            zoom={3}
            minZoom={3}
            maxZoom={10}
        >
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapComponent />
        </MapContainer>
    )
}

export default PlayersMap;