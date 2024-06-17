import { Button, DatePicker, Form, List, Modal, Popover, Progress, Space, Tooltip, Typography, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { selectGameInvites, selectTeamsState } from "stores/teams";
import { InfoCircleOutlined, DeleteOutlined, CheckOutlined, QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { createGameInvite, getGameInvites, removeGameInvite, voteGameInvite } from "stores/teams/async-actions";
import { useEffect } from "react";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import styles from './TeamsGames.module.css'
import Card from "antd/es/card/Card";
import { convertDate, convertFullDate } from "shared/DateConverter";
import TeamItem from "shared/TeamItem";
import PlayerItem from "shared/PlayerItem";

const { Text, Title } = Typography;

const TeamsGames = () => {
    const dispatch = useAppDispatch();

    const [modal, contextHolder] = Modal.useModal();

    const teamsState = useSelector(selectTeamsState);
    const isAuth = useSelector(selectIsAuth);
    const gameInvites = useSelector(selectGameInvites);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        if (isAuth) {
            dispatch(getGameInvites())
        }
    }, [isAuth])

    const onCreateGameInvite = (values: any) => {
        dispatch(createGameInvite({
            date: values.date
        })).unwrap().then((message: string) => {
            if (message.length !== 0) {
                notification.info({
                    message: message
                })
            }
            dispatch(getGameInvites())
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
            })).unwrap().then(() => {
                dispatch(getGameInvites())
            })
        }
    }

    const onVoteGameInvite = (inviteId: string) => {
        dispatch(voteGameInvite({
            inviteId: inviteId
        })).unwrap().then(() => {
            dispatch(getGameInvites())
        })
    }

    return (
        <div>
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
                    <Card title={"Game invites"}>
                        <div className={styles.gameInviteContainer}>
                            {gameInvites.map(x => {
                                return <Card hoverable className={styles.gameInviteItem} >
                                    <div className={styles.timeTitle}>
                                        {x.isCurrentTeam && teamsState.team &&
                                            <TeamItem id={teamsState.team.id} name={teamsState.team.name} />
                                        }
                                        {!x.isCurrentTeam &&
                                            <>
                                                <QuestionCircleOutlined style={{ fontSize: 24, opacity: 0.7 }} />

                                            </>
                                        }
                                        <Text>{convertFullDate(x.date)}</Text>
                                        <Text type="secondary">{convertDate(x.date)}</Text>
                                    </div>
                                    <div className={styles.actions}>
                                        {teamsState.team &&
                                            <>
                                                <Popover
                                                    placement="bottom"
                                                    content={
                                                        <List
                                                            size="small"
                                                            itemLayout="horizontal"
                                                            dataSource={teamsState.team.players}
                                                            renderItem={(item, index) => (
                                                                <List.Item>
                                                                    <div className={styles.voteStatus}>
                                                                        <PlayerItem id={item.id} name={item.name} />
                                                                        {x.votes.findIndex(x => x.id === item.id) !== -1 &&
                                                                            <CheckOutlined style={{ color: "green" }} />
                                                                        }
                                                                        {x.votes.findIndex(x => x.id === item.id) === -1 &&
                                                                            <CloseOutlined style={{ color: "red" }} />
                                                                        }
                                                                    </div>
                                                                </List.Item>
                                                            )}
                                                        />
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
            {contextHolder}
        </div>
    )
}

export default TeamsGames;