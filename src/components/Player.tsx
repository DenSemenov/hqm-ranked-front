import { Avatar, Col, Row } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CardComponent, { EdgeType } from "shared/CardComponent";
import { selectCurrentDivision, selectCurrentPlayerData } from "stores/season";
import { getPlayerData } from "stores/season/async-actions";
import styles from './Player.module.css'
import { convertDate } from "shared/DateConverter";
import PlayerItem from "shared/PlayerItem";

const Player = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentDivision = useSelector(selectCurrentDivision);
    const currentPlayerData = useSelector(selectCurrentPlayerData);

    useEffect(() => {
        const id = searchParams.get("id");
        if (currentDivision && id) {
            dispatch(getPlayerData({
                id: id,
                divisionId: currentDivision
            }));
        }
    }, [currentDivision]);


    return currentPlayerData ? (
        <Row gutter={[32, 32]}>
            <Col sm={8} xs={24}>
                <CardComponent edges={[EdgeType.RightTop]}>
                    <div className={styles.playerLeft}>
                        <Avatar size={190} shape="square">{currentPlayerData.name}</Avatar>
                        <h3 className={styles.playerLeftTitle}>{currentPlayerData.name}</h3>
                        <div className={styles.playerLeftStats}>
                            <Row>
                                <Col span={8}>
                                    <h4>GAMES</h4>
                                    <h4>GOALS</h4>
                                    <h4>BLOCKS</h4>
                                </Col>
                                <Col span={4}>
                                    <span className={styles.playerLeftStatsCount}>{currentPlayerData.games}</span>
                                    <span className={styles.playerLeftStatsCount}>{currentPlayerData.goals}</span>
                                    <span className={styles.playerLeftStatsCount}>0</span>
                                </Col>
                                <Col span={8}>
                                    <h4>POINTS</h4>
                                    <h4>ASSISTS</h4>
                                    <h4>TACKLES</h4>
                                </Col>
                                <Col span={4}>
                                    <span className={styles.playerLeftStatsCount}>{currentPlayerData.points}</span>
                                    <span className={styles.playerLeftStatsCount}>{currentPlayerData.assists}</span>
                                    <span className={styles.playerLeftStatsCount}>0</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </CardComponent>
            </Col>
            <Col sm={10} xs={24}>
                <CardComponent edges={[EdgeType.RightTop]}>
                    <div className={styles.playerCenter}>
                        <h3>RANKED</h3>
                        <div className={styles.playerCenterStats}>
                            <div className={styles.playerCenterItem}>
                                <div >
                                    POS
                                </div>
                                <div >
                                    {"#" + currentPlayerData.currentSeasonData.position}
                                </div>
                            </div>
                            <div className={styles.playerCenterItem}>
                                <div >
                                    GP
                                </div>
                                <div >
                                    {currentPlayerData.currentSeasonData.games}
                                </div>
                            </div>
                            <div className={styles.playerCenterItem}>
                                <div >
                                    G
                                </div>
                                <div >
                                    {currentPlayerData.currentSeasonData.goals}
                                </div>
                            </div>
                            <div className={styles.playerCenterItem}>
                                <div >
                                    A
                                </div>
                                <div >
                                    {currentPlayerData.currentSeasonData.assists}
                                </div>
                            </div>
                            <div className={styles.playerCenterItem}>
                                <div >
                                    ELO
                                </div>
                                <div >
                                    {currentPlayerData.currentSeasonData.elo}
                                </div>
                            </div>
                        </div>
                        <div className={styles.playerCenterGames}>
                            {currentPlayerData.lastGames.map(game => {
                                return <div className={styles.playerCenterGamesItem}>
                                    <Row gutter={[0, 16]}>
                                        <Col span={24} className="subtitle">
                                            {convertDate(game.date)}
                                        </Col>
                                        <Col span={9}>
                                            <div>{"TEAM "}<PlayerItem id={game.teamRedId} name={game.teamRedName} /></div>
                                        </Col>
                                        <Col span={6} className={styles.playerCenterGamesItemScore}>
                                            {game.redScore + " - " + game.blueScore}
                                        </Col>
                                        <Col span={9} className="right-align">
                                            <div>{"TEAM "}<PlayerItem id={game.teamBlueId} name={game.teamBlueName} /></div>
                                        </Col>
                                        <Col span={9}>

                                            {game.team === 0 && <div className="subtitle">{"G:" + game.goals + " A:" + game.assists}</div>}
                                        </Col>
                                        <Col span={6} />
                                        <Col span={9} className="right-align">
                                            {game.team === 1 && <div className="subtitle">{"G:" + game.goals + " A:" + game.assists}</div>}
                                        </Col>
                                    </Row>
                                </div>
                            })}
                        </div>
                    </div>
                </CardComponent>
            </Col>
            <Col sm={6} xs={24}>
                <CardComponent edges={[EdgeType.RightTop]}>
                    <div className={styles.playerRight}>
                        <h3>SEASONS</h3>
                        {currentPlayerData.lastSeasons.map(season => {
                            return <Row>
                                <Col span={16}>
                                    {season.name}
                                </Col>
                                <Col span={8} className="right-align">
                                    {season.place}
                                </Col>
                            </Row>

                        })}
                    </div>
                </CardComponent>
            </Col>
        </Row>
    ) : <div />
}

export default Player;