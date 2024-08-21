import { Avatar, Button, Col, DatePicker, Form, InputNumber, List, Modal, Popover, Progress, Row, Slider, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { selectGameInvites, selectTeamsState } from "stores/teams";
import { InfoCircleOutlined, DeleteOutlined, CheckOutlined, QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { createGameInvite, getGameInvites, removeGameInvite, voteGameInvite } from "stores/teams/async-actions";
import { useEffect, useState } from "react";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import styles from './TeamsGames.module.css'
import Card from "antd/es/card/Card";
import { convertDate, convertFullDate } from "shared/DateConverter";
import TeamItem from "shared/TeamItem";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import { selectCurrentSeason, selectCurrentSeasonGames } from "stores/season";
import { useNavigate } from "react-router-dom";
import { IInstanceType } from "models/IInstanceType";
import { CaretRightOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";

const { Text, Title } = Typography;

const TeamsGames = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [modal, contextHolder] = Modal.useModal();

    const teamsState = useSelector(selectTeamsState);
    const isAuth = useSelector(selectIsAuth);
    const gameInvites = useSelector(selectGameInvites);
    const currentUser = useSelector(selectCurrentUser);
    const currentSeasonGames = useSelector(selectCurrentSeasonGames);
    const currentSeason = useSelector(selectCurrentSeason);

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

    useEffect(() => {
        if (isAuth) {
            dispatch(getGameInvites())
        }
    }, [isAuth])

    const onCreateGameInvite = (values: any) => {
        dispatch(createGameInvite({
            date: values.date,
            countGames: values.countGames
        })).unwrap().then((message: string) => {
            if (message.length !== 0) {
                notification.info({
                    message: message
                })
            }
        })
    }

    const onRemoveGameInvite = async (inviteId: string) => {
        const confirmed = await modal.confirm({
            title: "Are you sure you want remove this game invite?",
            okText: "Remove"
        });
        if (confirmed) {
            dispatch(removeGameInvite({
                inviteId: inviteId
            }))
        }
    }

    const onVoteGameInvite = (inviteId: string) => {
        if (currentSeason) {
            dispatch(voteGameInvite({
                inviteId: inviteId
            }))
        }
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                {(teamsState.isCaptain || teamsState.isAssistant) &&
                    <Popover
                        title="Create game invite"
                        content={
                            <Form
                                layout="vertical"
                                onFinish={onCreateGameInvite}
                            >
                                <Form.Item
                                    label={<Space>
                                        <span>Date</span>
                                        <Tooltip title="Your local time">
                                            <InfoCircleOutlined />
                                        </Tooltip>
                                    </Space>}
                                    name="date"
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm"
                                        showHour
                                        showMinute
                                        showTime
                                        minuteStep={30}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Games count"}
                                    name="countGames"
                                >
                                    <Slider min={1} max={4} />
                                </Form.Item>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit">
                                        Create
                                    </Button>
                                </Form.Item>
                            </Form>
                        }
                        trigger={"click"}
                    >
                        <Button style={{ width: "100%" }} type="primary">Create game invite</Button>
                    </Popover>
                }
                {gameInvites.length !== 0 &&
                    <Card bordered={false} title={"Game invites"}>
                        <div className={styles.gameInviteContainer}>
                            {gameInvites.map(x => {
                                return <Card bordered={false} hoverable className={styles.gameInviteItem} >
                                    <div className={styles.timeTitle}>
                                        {x.isCurrentTeam && teamsState.team &&
                                            <TeamItem id={teamsState.team.id} name={teamsState.team.name} />
                                        }
                                        {!x.isCurrentTeam &&
                                            <>
                                                <QuestionCircleOutlined style={{ fontSize: 24, opacity: 0.7 }} />
                                            </>
                                        }
                                        <Text type="secondary">{convertDate(x.date)}</Text>
                                    </div>
                                    <div className={styles.timeTitle}>
                                        <Tag>{x.gamesCount + " games"}</Tag>
                                        <Text>{convertFullDate(x.date)}</Text>
                                    </div>
                                    <div className={styles.actions}>
                                        {teamsState.team &&
                                            <>
                                                <Popover
                                                    placement="bottom"
                                                    content={
                                                        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
                                                            <Title level={5}>Your team</Title>
                                                            {teamsState.team.players.map(item => {
                                                                return <div className={styles.voteStatus}>
                                                                    <PlayerItem id={item.id} name={item.name} />
                                                                    {x.votes.findIndex(x => x.id === item.id) !== -1 &&
                                                                        <CheckOutlined style={{ color: "green" }} />
                                                                    }
                                                                    {x.votes.findIndex(x => x.id === item.id) === -1 &&
                                                                        <CloseOutlined style={{ color: "red" }} />
                                                                    }
                                                                </div>
                                                            })}
                                                            {x.otherTeams.length !== 0 &&
                                                                <Title level={5}>Other teams</Title>
                                                            }
                                                            {x.otherTeams.map(t => {
                                                                return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                    <span>{t.name}</span>
                                                                    <Progress steps={teamsState.teamsMaxPlayers} percent={t.votes / teamsState.teamsMaxPlayers * 100} />
                                                                </div>
                                                            })}

                                                        </div>
                                                    }
                                                >
                                                    <Progress percent={x.votes.length / teamsState.teamsMaxPlayers * 100} />
                                                </Popover>
                                                <Button title={"Vote"} type="text" icon={x.votes.findIndex(y => y.id === currentUser?.id) === -1 ? <CheckOutlined /> : <CloseOutlined />} onClick={() => onVoteGameInvite(x.id)} />
                                            </>
                                        }
                                        {x.isCurrentTeam && (teamsState.isCaptain || teamsState.isAssistant) &&
                                            <Button title={"Remove game invite"} danger type="text" icon={<DeleteOutlined />} onClick={() => onRemoveGameInvite(x.id)} />
                                        }
                                    </div>
                                </Card>
                            })}
                        </div>
                    </Card>
                }

            </div>
            <div id="games-container" style={{ flex: "auto" }}>
                <List
                    dataSource={currentSeasonGames.filter(x => x.instanceType === IInstanceType.Teams)}
                    style={{ overflow: "auto" }}
                    renderItem={(game, index) => {
                        return <div className={styles.gamesItem} key={game.gameId} onClick={() => navigate("/game?id=" + game.gameId)}>
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
                                        <TeamItem id={game.redTeamId as string} name={game.redTeamName as string} />
                                        {"vs"}
                                        <TeamItem id={game.blueTeamId as string} name={game.blueTeamName as string} />
                                    </div>
                                </Col>
                                <Col span={8} className={styles.gameContent} >
                                    {game.redScore + " - " + game.blueScore}
                                </Col>
                            </Row>
                        </div>
                    }}
                />
            </div>
            {contextHolder}
        </div>
    )
}

export default TeamsGames;