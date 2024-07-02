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
import { convertMoney } from "shared/MoneyCoverter";
import { IInstanceType } from "models/IInstanceType";
import TeamItem from "shared/TeamItem";
import { Line } from '@ant-design/plots';
import { selectTheme } from "stores/auth";
import { AwardType, PlayerAwardViewModel } from "models/IPlayerResponse";

const { Text, Title } = Typography;

const Player = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentPlayerData = useSelector(selectCurrentPlayerData);
    const storageUrl = useSelector(selectStorageUrl);
    const loading = useSelector(selectLoading);
    const theme = useSelector(selectTheme);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            dispatch(getPlayerData({
                id: +id
            }));
        }
    }, [searchParams]);

    const getAward = (award: PlayerAwardViewModel) => {
        let text = "";
        let icon = award.seasonName !== "" ? <svg xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 91 91" enable-background="new 0 0 91 91" id="Layer_1" version="1.1" >
            <g>
                <g>
                    <path d="M16.084,38.938h-0.332c-8.271,0-15.002-6.68-15.002-14.888V11.007c0-1.846,1.494-3.34,3.342-3.34h14.494    c1.844,0,3.34,1.494,3.34,3.34v23.664c0.018,0.266,0.027,0.424,0.029,0.586c0.025,1.588-1.072,2.975-2.625,3.314    C18.201,38.819,17.139,38.938,16.084,38.938z M7.432,14.347v9.703c0,4.359,3.461,7.935,7.814,8.193V14.347H7.432z" fill="#45596B" />
                    <path d="M18.615,37.769c-1.34,0-2.438-1.076-2.459-2.424c-0.02-0.334-0.029-0.502-0.029-0.674V11.007    c0-1.359,1.1-2.459,2.459-2.459c1.357,0,2.459,1.1,2.459,2.459l0.01,23.832c0.01,0.145,0.018,0.287,0.02,0.432    c0.021,1.359-1.063,2.477-2.42,2.498C18.641,37.769,18.629,37.769,18.615,37.769z" fill="#647F94" />
                    <path d="M75.32,38.938h-0.332c-1.057,0-2.121-0.119-3.25-0.367c-1.572-0.342-2.678-1.756-2.629-3.363    c0.004-0.152,0.016-0.303,0.027-0.453l0.01-23.748c0-1.846,1.494-3.34,3.34-3.34H86.98c1.844,0,3.34,1.494,3.34,3.34V24.05    C90.32,32.259,83.592,38.938,75.32,38.938z M75.826,14.347v17.896c4.352-0.258,7.814-3.833,7.814-8.193v-9.703H75.826z" fill="#45596B" />
                    <path d="M45.535,88.495c-1.844,0-3.342-1.496-3.342-3.34V58.304c0-1.842,1.498-3.34,3.342-3.34    c1.846,0,3.34,1.498,3.34,3.34v26.852C48.875,86.999,47.381,88.495,45.535,88.495z" fill="#45596B" />
                    <path d="M60.531,88.495H30.537c-1.844,0-3.34-1.496-3.34-3.34c0-1.846,1.496-3.34,3.34-3.34h29.994    c1.844,0,3.34,1.494,3.34,3.34C63.871,86.999,62.375,88.495,60.531,88.495z" fill="#45596B" />
                    <g>
                        <path d="M72.486,2.498H46.66v29.195c0,1.357-1.104,2.459-2.459,2.459H30.537c-1.357,0-2.459-1.102-2.459-2.459     V2.498h-9.492c-1.359,0-2.463,1.098-2.463,2.459l0.033,30.412c0.365,14.955,12.287,25.398,29,25.398h0.756     c16.711,0,28.635-10.443,28.994-25.453l0.039-30.357C74.945,3.595,73.844,2.498,72.486,2.498z" fill="#647F94" />
                        <rect fill="#6EC4A7" height="26.734" width="8.744" x="32.996" y="2.498" />
                    </g>
                </g>
            </g>
        </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 91 91" enable-background="new 0 0 91 91" id="Layer_1" version="1.1" >
                <g>
                    <g>
                        <path d="M13.012,55.145L0.449,72.08l14.625,1.684c1.09,0.125,2.029,0.834,2.453,1.85l5.629,13.564l13.34-17.691    C26.754,69.174,18.41,63.236,13.012,55.145z" fill="#647F94" />
                        <path d="M78.029,55.049c-5.34,8.051-13.586,13.98-23.225,16.354l13.402,17.775l5.627-13.564    c0.42-1.016,1.359-1.725,2.449-1.85l14.586-1.678L78.029,55.049z" fill="#647F94" />
                        <path d="M45.49,16.163c-9.59,0-17.389,7.801-17.389,17.39c0,9.586,7.799,17.385,17.389,17.385    c9.588,0,17.391-7.799,17.391-17.385C62.881,23.964,55.078,16.163,45.49,16.163z" fill="#6EC4A7" />
                        <path d="M78.455,33.552c0-18.178-14.787-32.967-32.963-32.967c-18.178,0-32.965,14.789-32.965,32.967    c0,18.174,14.787,32.961,32.965,32.961C63.668,66.514,78.455,51.727,78.455,33.552z M45.49,56.996    c-12.93,0-23.445-10.516-23.445-23.444c0-12.929,10.516-23.449,23.445-23.449c12.932,0,23.447,10.521,23.447,23.449    C68.938,46.48,58.422,56.996,45.49,56.996z" fill="#647F94" />
                    </g>
                </g>
            </svg>
        switch (award.awardType) {
            case AwardType.FirstPlace:
                text = "First place";
                break;
            case AwardType.SecondPlace:
                text = "Second place";
                break;
            case AwardType.ThirdPlace:
                text = "Third place";
                break;
            case AwardType.BestGoaleador:
                text = "Best goaleador";
                break;
            case AwardType.BestAssistant:
                text = "Best assistant";
                break;
            case AwardType.GamesPlayed:
                text = award.count + " games played";
                break;
            case AwardType.Goals:
                text = award.count + " goals";
                break;
            case AwardType.Assists:
                text = award.count + " assists";
                break;

        }

        return <div className={styles.award} style={{ borderColor: award.seasonName !== "" ? "rgb(16, 142, 233)" : "rgba(138, 138, 138, 0.4)" }}>
            {icon}
            <div className={styles.awardTitle}>
                <span style={{ fontWeight: award.seasonName !== "" ? 600 : 100 }}>{text}</span>
                {award.seasonName !== "" &&
                    <Text type="secondary">{award.seasonName}</Text>
                }
            </div>
        </div>;
    }


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
                    <Title level={3}>{convertMoney(currentPlayerData.cost)}</Title>
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
                    <div className={styles.playerCenterAwards}>
                        {currentPlayerData.awards.map(a => {
                            return getAward(a);
                        })}
                    </div>
                    <div className={styles.playerCenterGames}>
                        <Line
                            data={currentPlayerData.playerPoints.map((point, index) => {
                                return {
                                    game: index,
                                    elo: point
                                }
                            })}
                            xField='game'
                            yField='elo'
                            axis={{
                                x: false
                            }}
                            height={200}
                            theme={theme}
                        />
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
                                            {game.instanceType === IInstanceType.Ranked &&
                                                <>
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
                                                </>
                                            }
                                            {game.instanceType === IInstanceType.Teams &&
                                                <>
                                                    <TeamItem id={game.redTeamId as string} name={game.redTeamName as string} />
                                                    {"vs"}
                                                    <TeamItem id={game.blueTeamId as string} name={game.blueTeamName as string} />
                                                </>
                                            }
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