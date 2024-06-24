import styles from './Games.module.css'
import { useSelector } from "react-redux";
import { selectCurrentSeason, selectCurrentSeasonGames } from "stores/season";
import { Avatar, Button, Card, Col, List, Row, Tag } from "antd";
import { convertDate } from "shared/DateConverter";
import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import { useNavigate } from "react-router-dom";
import { getSeasonsGames } from 'stores/season/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { CaretRightOutlined } from "@ant-design/icons";
import { IInstanceType } from 'models/IInstanceType';
import { IGamePlayerItem, ISeasonGameResponse } from 'models/ISeasonGameResponse';
import VirtualList from 'rc-virtual-list';

const Games = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentSeasonGames = useSelector(selectCurrentSeasonGames);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        const gc = document.getElementById("games-container");
        if (gc) {
            let h = gc.clientHeight;
            setHeight(h);
        }

    }

    const filteredGames = useMemo(() => {
        return currentSeasonGames.filter(x => x.instanceType === IInstanceType.Ranked);
    }, [currentSeasonGames])

    const renderTeamPlayers = (players: IGamePlayerItem[], team: number) => {
        return (
            <Avatar.Group>
                {players.map(x => {
                    if (x.team === team) {
                        return <PlayerItem key={x.id} id={x.id} name={x.name} type={PlayerItemType.Avatar} />;
                    }
                })}
            </Avatar.Group>
        );
    };

    return (
        <div id="games-container" style={{ height: "100%" }}>
            <List>
                <VirtualList
                    data={filteredGames}
                    height={height}
                    itemHeight={80}
                    itemKey="gameId"
                >
                    {(game: ISeasonGameResponse) => (
                        <div className={styles.gamesItem} key={game.gameId} onClick={() => navigate("/game?id=" + game.gameId)}>
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
                                        {renderTeamPlayers(game.players, 0)} vs {renderTeamPlayers(game.players, 1)}
                                    </div>
                                </Col>
                                <Col span={8} className={styles.gameContent} >
                                    {game.redScore + " - " + game.blueScore}
                                </Col>
                            </Row>
                        </div>
                    )}
                </VirtualList>
            </List>
        </div>
    )
}

export default Games;