import { Button, Card, Col, Row, Table, Tag, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { convertDate } from "shared/DateConverter";
import { selectCurrentGameData } from "stores/season";
import { getGameData, getReplay } from "stores/season/async-actions";
import styles from './Game.module.css'
import PlayerItem from "shared/PlayerItem";

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

    const onGetReplay = (id: string) => {
        dispatch(getReplay({
            id: id
        })).unwrap().then((data: any) => {
            const linkSource = `data:application/pdf;base64,${data}`;
            const downloadLink = document.createElement('a');
            document.body.appendChild(downloadLink);

            downloadLink.href = linkSource;
            downloadLink.target = '_self';
            downloadLink.download = "replay" + id + ".hrp";
            downloadLink.click();
        });
    }

    return currentGameData ? (
        <Row gutter={[0, 16]}>
            <Col xs={24} sm={8}>
                <Card bodyStyle={{ padding: 0 }}>
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
                    <Button type="primary" onClick={() => onGetReplay(currentGameData.replayId as string)}>Download replay</Button>
                }
                {currentGameData.hasReplayFragments &&
                    <Button type="primary" onClick={() => navigate("/replay?id=" + currentGameData.replayId)}>Watch replay</Button>
                }
            </Col>
            <Col xs={24} sm={8} className="right-align">
                <Card bodyStyle={{ padding: 0 }}>
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
        </Row>
    ) : <div />
}

export default Game;