import styles from './Games.module.css'
import { useSelector } from "react-redux";
import { selectCurrentSeason, selectCurrentSeasonGames } from "stores/season";
import { Avatar, Button, Card, Col, Row, Tag } from "antd";
import { convertDate } from "shared/DateConverter";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import { useNavigate } from "react-router-dom";
import { getSeasonsGames } from 'stores/season/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { CaretRightOutlined } from "@ant-design/icons";

const Games = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentSeasonGames = useSelector(selectCurrentSeasonGames);
    const currentSeason = useSelector(selectCurrentSeason);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, []);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 42 - 32 - 16 * 2 - 425;
        setHeight(h);
    }

    const onScroll = (e: any) => {
        if (currentSeason) {
            const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) {
                dispatch(getSeasonsGames({
                    seasonId: currentSeason,
                    offset: currentSeasonGames.length,
                }));
            }
        }
    }

    return (
        <Card title={!isMobile ? "Games" : undefined} bodyStyle={{ padding: 0 }} bordered={false} style={{ height: !isMobile ? height : undefined, width: "100%", marginBottom: !isMobile ? 32 : undefined }}>
            <div style={!isMobile ? { height: "100%", overflow: "auto" } : undefined} onScroll={onScroll}>
                {currentSeasonGames.map(game => (
                    <div className={styles.gamesItem} onClick={() => navigate("/game?id=" + game.gameId)}>
                        <Row gutter={[8, 8]} >
                            <Col span={16}>
                                <span className="subtitle">{convertDate(game.date)}</span>
                            </Col>
                            <Col span={8} className={styles.gameStatus}>
                                {game.hasReplayFragments &&
                                    <Button size="small" icon={<CaretRightOutlined />} type="primary" onClick={(e) => {
                                        e.stopPropagation();
                                        navigate("/replay?id=" + game.replayId)
                                    }} />
                                }
                                <Tag style={{ marginRight: 0 }}>{game.status}</Tag>
                            </Col>
                            <Col span={16} className={styles.gameContentName}>
                                <div className={styles.teamTitle}>
                                    <Avatar.Group>
                                        {game.players.filter(x => x.team == 0).map(x => {
                                            return <PlayerItem id={x.id} name={x.name} type={PlayerItemType.Avatar} />
                                        })}
                                    </Avatar.Group>
                                    {"vs"}
                                    <Avatar.Group>
                                        {game.players.filter(x => x.team == 1).map(x => {
                                            return <PlayerItem id={x.id} name={x.name} type={PlayerItemType.Avatar} />
                                        })}
                                    </Avatar.Group>
                                </div>
                            </Col>
                            <Col span={8} className={styles.gameContent} >
                                {game.redScore + " - " + game.blueScore}
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default Games;