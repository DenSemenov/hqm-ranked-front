import { Button, Card, Col, List, Row, Table, Tag, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { convertDate } from "shared/DateConverter";
import { selectCurrentGameData } from "stores/season";
import { getGameData, getReplay } from "stores/season/async-actions";
import styles from './Game.module.css'
import PlayerItem from "shared/PlayerItem";
import { CaretRightOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const Game = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const currentGameData = useSelector(selectCurrentGameData);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            dispatch(getGameData({
                id: id
            }));
        }
    }, []);

    const getPeriodWithTime = (period: number, time: number) => {
        let p = period + " period";
        if (period > 3) {
            p = "OT";
        }

        const m = Math.floor(time / 100 / 60);
        const s = time / 100 - m * 60;

        let secString = Math.round(s).toString();

        if (secString.length === 1) {
            secString = "0" + secString;
        }

        return p + " " + m + ":" + secString;
    }


    return currentGameData ? (
        <Row gutter={[0, 16]}>
            <Col xs={24} sm={8}>
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        dataSource={currentGameData.players.filter(x => x.team == 0)}
                        bordered={false}
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
                                title: "Score",
                                align: "right",
                                dataIndex: "score"
                            },
                        ]}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={8} className={styles.centerData}>
                <Title level={3}>{currentGameData.redScore + " - " + currentGameData.blueScore}</Title>
                <Text type="secondary">{convertDate(currentGameData.date)}</Text>
                <Tag>{currentGameData.state}</Tag>
                {currentGameData.replayId &&
                    <Link to={currentGameData.replayUrl}>
                        <Button type="primary" >Download replay</Button>
                    </Link>
                }
                {currentGameData.hasReplayFragments &&
                    <Button type="primary" onClick={() => navigate("/replay?id=" + currentGameData.replayId)}>Watch replay</Button>
                }
            </Col>
            <Col xs={24} sm={8} className="right-align">
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        dataSource={currentGameData.players.filter(x => x.team == 1)}
                        bordered={false}
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
                                title: "Score",
                                align: "right",
                                dataIndex: "score"
                            },
                        ]}
                    />
                </Card>
            </Col>
            {currentGameData.hasReplayFragments &&
                <>
                    <Title level={5}>Goals</Title>
                    <Row gutter={[16, 16]} style={{ width: "calc(16px + 100%)" }}>
                        {currentGameData.goals.map(goal => {
                            return <Col sm={4} xs={8} >
                                <Card size="small" title={"Goal"} extra={<Text type="secondary">{getPeriodWithTime(goal.period, goal.time)}</Text>}>
                                    <Row>
                                        <Col span={18}>
                                            <Title level={5}>{goal.goalBy}</Title>
                                        </Col>
                                        <Col span={6} className="right-align">
                                            <Button size="small" icon={<CaretRightOutlined />} type="primary" onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/replay?id=" + currentGameData.replayId + "&t=" + goal.packet)
                                            }} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        })}
                    </Row>
                </>
            }
        </Row>
    ) : <div />
}

export default Game;