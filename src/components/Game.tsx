import { Button, Card, Col, List, Progress, Row, Table, Tag, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { convertDate } from "shared/DateConverter";
import { selectCurrentGameData, selectLoading } from "stores/season";
import { getGameData, getReplay } from "stores/season/async-actions";
import styles from './Game.module.css'
import PlayerItem from "shared/PlayerItem";
import { CaretRightOutlined } from "@ant-design/icons";
import { orderBy, sum, uniqBy } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { IInstanceType } from "models/IInstanceType";
import TeamItem from "shared/TeamItem";
import { IoMdDownload } from "react-icons/io";
import { FaPlay } from "react-icons/fa";

const { Text, Title } = Typography;

const Game = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const currentGameData = useSelector(selectCurrentGameData);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            dispatch(getGameData({
                id: id
            }));
        }
    }, []);

    const getPeriodWithTime = (period: number, time: number) => {
        let p = period + "p";
        if (period > 3) {
            p = "OT";
        }

        const m = Math.floor(time / 100 / 60);
        const s = time / 100 - m * 60;

        let secString = Math.round(s).toString();

        if (secString.length === 1) {
            secString = "0" + secString;
        }

        return <><Text type="secondary">{p} </Text> <Text>{m + ":" + secString}</Text></>
    }

    const goals = useMemo(() => {
        if (currentGameData) {
            const ordered = orderBy(currentGameData.goals, "packet");
            return uniqBy(ordered, "packet")
        } else {
            return []
        }
    }, [currentGameData])


    return currentGameData && !loading ? (
        <Row gutter={[0, 16]}>

            <Col xs={24} sm={8}>
                <Card
                    styles={{ body: { padding: 0 } }}
                    title={currentGameData.instanceType === IInstanceType.Teams ? <div className={styles.team}>
                        <TeamItem id={currentGameData.redTeamId as string} name={currentGameData.redTeamName as string} />
                        <Tag style={{ fontSize: 12 }} color={currentGameData.redPoints >= 0 ? "success" : "error"}>{currentGameData.redPoints}</Tag>
                    </div>
                        : undefined
                    }
                >
                    <Table
                        dataSource={currentGameData.players.filter(x => x.team == 0)}

                        pagination={false}
                        rowKey={"id"}
                        columns={[
                            {
                                title: "Name",
                                dataIndex: "name",
                                render(value, record, index) {
                                    return <PlayerItem id={record.id} name={record.name} />
                                },
                            },
                            {
                                title: "G",
                                align: "right",
                                dataIndex: "goals"
                            },
                            {
                                title: "A",
                                align: "right",
                                dataIndex: "assists"
                            },
                            {
                                title: "Shots",
                                align: "right",
                                dataIndex: "shots",
                                render(value, record, index) {
                                    const total = record.shots > record.goals ? record.shots : record.goals;
                                    let percent = Math.round(100 / total * record.goals);
                                    if (isNaN(percent)) {
                                        percent = 0;
                                    }
                                    return <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "right" }}>
                                        <Tag>{record.goals + "/" + total}</Tag>
                                        <Progress type="circle" size={32} percent={percent} format={() => percent} status={percent === 0 ? "exception" : undefined} />
                                    </div>
                                },
                            },
                            {
                                title: "Saves",
                                align: "right",
                                dataIndex: "saves",
                                render(value, record, index) {
                                    const total = record.conceded + record.saves;
                                    let percent = Math.round(100 / total * value)
                                    if (isNaN(percent)) {
                                        percent = 0;
                                    }
                                    return <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "right" }}>
                                        <Tag>{value + "/" + total}</Tag>
                                        <Progress type="circle" size={32} percent={percent} format={() => percent} />
                                    </div>
                                },
                            },
                            {
                                title: "Possession",
                                align: "right",
                                dataIndex: "possession",
                                render(value, record, index) {
                                    const total = sum(currentGameData.players.filter(x => x.team == 0).map(x => x.possession))
                                    return <Progress type="circle" size={32} percent={Math.round(100 / total * value)} />
                                },
                            },
                            {
                                title: "Score",
                                align: "right",
                                dataIndex: "score",
                                hidden: currentGameData.instanceType === IInstanceType.Teams,
                                render(value, record, index) {
                                    return <Tag style={{ fontSize: 12 }} color={value >= 0 ? "success" : "error"}>{value}</Tag>
                                },
                            },
                        ]}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={8} className={styles.centerData}>
                <Title level={1}>{currentGameData.redScore + " - " + currentGameData.blueScore}</Title>
                <Text type="secondary">{convertDate(currentGameData.date)}</Text>
                <div style={{ display: "flex", gap: 8 }}>
                    <Tag>{currentGameData.state}</Tag>
                    {currentGameData.replayId &&
                        <Link to={currentGameData.replayUrl}>
                            <Button type="primary" size="small" icon={<IoMdDownload />} />
                        </Link>
                    }
                    {currentGameData.hasReplayFragments &&
                        <Button type="primary" onClick={() => navigate("/replay?id=" + currentGameData.id)} size="small" icon={<FaPlay />} />
                    }
                </div>
            </Col>
            <Col xs={24} sm={8} className="right-align">
                <Card
                    styles={{ body: { padding: 0 } }}
                    title={currentGameData.instanceType === IInstanceType.Teams ? <div className={styles.team}>
                        <TeamItem id={currentGameData.blueTeamId as string} name={currentGameData.blueTeamName as string} />
                        <Tag style={{ fontSize: 12 }} color={currentGameData.bluePoints >= 0 ? "success" : "error"}>{currentGameData.bluePoints}</Tag>
                    </div>
                        : undefined
                    }
                >
                    <Table
                        dataSource={currentGameData.players.filter(x => x.team == 1)}

                        pagination={false}
                        rowKey={"id"}
                        columns={[
                            {
                                title: "Name",
                                dataIndex: "name",
                                render(value, record, index) {
                                    return <PlayerItem id={record.id} name={record.name} />
                                },
                            },
                            {
                                title: "G",
                                align: "right",
                                dataIndex: "goals"
                            },
                            {
                                title: "A",
                                align: "right",
                                dataIndex: "assists"
                            },
                            {
                                title: "Shots",
                                align: "right",
                                dataIndex: "shots",
                                render(value, record, index) {
                                    const total = record.shots > record.goals ? record.shots : record.goals;
                                    let percent = Math.round(100 / total * record.goals);
                                    if (isNaN(percent)) {
                                        percent = 0;
                                    }
                                    return <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "right" }}>
                                        <Tag>{record.goals + "/" + total}</Tag>
                                        <Progress type="circle" size={32} percent={percent} format={() => percent} status={percent === 0 ? "exception" : undefined} />
                                    </div>
                                },
                            },
                            {
                                title: "Saves",
                                align: "right",
                                dataIndex: "saves",
                                render(value, record, index) {
                                    const total = record.conceded + record.saves;
                                    let percent = Math.round(100 / total * value)
                                    if (isNaN(percent)) {
                                        percent = 0;
                                    }
                                    return <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "right" }}>
                                        <Tag>{value + "/" + total}</Tag>
                                        <Progress type="circle" size={32} percent={percent} format={() => percent} />
                                    </div>
                                },
                            },
                            {
                                title: "Possession",
                                align: "right",
                                dataIndex: "possession",
                                render(value, record, index) {
                                    const total = sum(currentGameData.players.filter(x => x.team == 1).map(x => x.possession))
                                    return <Progress type="circle" size={32} percent={Math.round(100 / total * value)} />
                                },
                            },
                            {
                                title: "Score",
                                align: "right",
                                dataIndex: "score",
                                hidden: currentGameData.instanceType === IInstanceType.Teams,
                                render(value, record, index) {
                                    return <Tag style={{ fontSize: 12 }} color={value >= 0 ? "success" : "error"}>{value}</Tag>
                                },
                            },
                        ]}
                    />
                </Card>
            </Col>
            {currentGameData.hasReplayFragments &&
                <Col span={24} className="center-align">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        {goals.map(goal => {
                            const player = currentGameData.players.find(x => x.name === goal.goalBy)
                            if (player) {
                                const isRed = player.team === 0;
                                return <div style={{ display: "flex", gap: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <PlayerItem id={player.id} name={player.name} style={isRed ? {} : { opacity: 0 }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                                        <Button size="small" icon={<CaretRightOutlined />} type="primary" onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("/replay?id=" + currentGameData.replayId + "&t=" + goal.packet)
                                        }} >
                                            {getPeriodWithTime(goal.period, goal.time)}
                                        </Button>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                        <PlayerItem id={player.id} name={player.name} style={!isRed ? {} : { opacity: 0 }} />
                                    </div>
                                </div>
                            }
                        })}
                    </div>
                </Col>
            }
        </Row>
    ) : <div className='content-loading-in'>
        <LoadingOutlined style={{ fontSize: 64 }} />
    </div>
}

export default Game;