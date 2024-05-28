import { Avatar, Col, Dropdown, Row, Space, Tag, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectCurrentPlayerData, selectLoading, selectStorageUrl } from "stores/season";
import { getPlayerData } from "stores/season/async-actions";
import styles from './Player.module.css'
import { convertDate } from "shared/DateConverter";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import { DownOutlined } from '@ant-design/icons';
import { LoadingOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const Player = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentPlayerData = useSelector(selectCurrentPlayerData);
    const storageUrl = useSelector(selectStorageUrl);
    const loading = useSelector(selectLoading);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            dispatch(getPlayerData({
                id: +id
            }));
        }
    }, [searchParams]);


    return currentPlayerData && !loading ? (
        <Row gutter={[32, 32]}>
            <Col sm={8} xs={24}>
                <div className={styles.playerLeft}>
                    <Avatar size={190} shape="square" src={storageUrl + "images/" + currentPlayerData.id + ".png"}>{currentPlayerData.name}</Avatar>
                    <Dropdown
                        menu={{
                            items: currentPlayerData.oldNicknames.map(n => {
                                return {
                                    key: n,
                                    label: n
                                }
                            })
                        }}
                        placement="bottom"
                        arrow
                    >
                        <Title level={3}>
                            <Space>
                                {currentPlayerData.name}
                                {currentPlayerData.oldNicknames.length !== 0 &&
                                    <DownOutlined />
                                }
                            </Space>
                        </Title>
                    </Dropdown>
                    <div className={styles.playerLeftStats}>
                        <Row>
                            <Col span={8}>
                                <h4>GAMES</h4>
                                <h4>GOALS</h4>
                            </Col>
                            <Col span={4}>
                                <span className={styles.playerLeftStatsCount}>{currentPlayerData.games}</span>
                                <span className={styles.playerLeftStatsCount}>{currentPlayerData.goals}</span>
                            </Col>
                            <Col span={8}>
                                <h4>POINTS</h4>
                                <h4>ASSISTS</h4>
                            </Col>
                            <Col span={4}>
                                <span className={styles.playerLeftStatsCount}>{currentPlayerData.points}</span>
                                <span className={styles.playerLeftStatsCount}>{currentPlayerData.assists}</span>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
            <Col sm={10} xs={24}>
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
                            return <div className={styles.playerCenterGamesItem} onClick={() => navigate("/game?id=" + game.gameId)}>
                                <Row gutter={[0, 16]}>
                                    <Col span={16}>
                                        <span className="subtitle">{convertDate(game.date)}</span>
                                    </Col>
                                    <Col span={8} className="right-align">
                                        <Tag color={game.score >= 0 ? "success" : "error"}>{game.score}</Tag>
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
                        })}
                    </div>
                </div>
            </Col>
            {/* <Col sm={6} xs={24}>
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
            </Col> */}
        </Row >
    ) : <div className='content-loading-in'>
        <LoadingOutlined style={{ fontSize: 64 }} />
    </div>
}

export default Player;