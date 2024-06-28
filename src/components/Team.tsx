import { Avatar, Col, List, Row, Table, Tag, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectLoading, selectStorageUrl } from "stores/season";
import styles from './Team.module.css'
import { getTeam } from "stores/teams/async-actions";
import { selectCurrentTeam, selectTeamsState } from "stores/teams";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import { convertMoney } from "shared/MoneyCoverter";
import { ITeamBudgetHistoryItemResponse } from "models/ITeamResponse";
import { IBudgetType } from "models/IBudgetType";
import Budget from "./Budget";

const { Text, Title } = Typography;

const Team = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentTeam = useSelector(selectCurrentTeam);
    const storageUrl = useSelector(selectStorageUrl);
    const teamsState = useSelector(selectTeamsState);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            dispatch(getTeam({
                teamId: id
            }));
        }
    }, [searchParams]);

    return currentTeam ? (
        <Row gutter={[32, 32]}>
            <Col sm={8} xs={24}>
                <div className={styles.playerLeft}>
                    <Avatar size={190} shape="square" src={storageUrl + "images/" + currentTeam.id + ".png"}>{currentTeam.name}</Avatar>
                    <div className={styles.playerLeft}>
                        <Title level={3}>
                            {currentTeam.name}
                        </Title>
                        <div className={styles.playerLeftStats}>
                            <Row>
                                <Col span={8}>
                                    <h4>GAMES</h4>
                                </Col>
                                <Col span={4}>
                                    <span className={styles.playerLeftStatsCount}>{currentTeam.games}</span>
                                </Col>
                                <Col span={8}>
                                    <h4>GOALS</h4>
                                </Col>
                                <Col span={4}>
                                    <span className={styles.playerLeftStatsCount}>{currentTeam.goals}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </Col>
            <Col sm={8} xs={24} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Row>
                    <Col span={12}>
                        <Title level={5}>PLAYERS</Title>
                    </Col>
                    <Col span={12} className="right-align">
                        <Title level={5} type="secondary">{currentTeam.players.length + "/" + teamsState.teamsMaxPlayers}</Title>
                    </Col>
                </Row>
                <List
                    itemLayout="horizontal"
                    dataSource={currentTeam.players}
                    bordered
                    renderItem={(item, index) => (
                        <List.Item style={{ display: "flex", alignItems: "center" }}>
                            <PlayerItem id={item.id} name={item.name} />
                            {item.id === currentTeam.captainId &&
                                <Tag>Captain</Tag>
                            }
                            {item.id === currentTeam.assistantId &&
                                <Tag>Assistant</Tag>
                            }
                        </List.Item>
                    )}
                />
                <Row>
                    <Col span={12}>
                        <Title level={5} style={{ marginTop: 16 }}>BUDGET</Title>
                    </Col>
                    <Col span={12} className="right-align">
                        <Title level={5} type="secondary" style={{ marginTop: 16 }}>{convertMoney(currentTeam.budgetHistory.map(x => x.change).reduce((partialSum, a) => partialSum + a, 0))}</Title>
                    </Col>
                </Row>

                <Budget items={currentTeam.budgetHistory} />
            </Col>
        </Row >
    ) : <div />
}

export default Team;