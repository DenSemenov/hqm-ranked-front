import { Avatar, Col, List, Row, Table, Tag, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectLoading, selectStorageUrl } from "stores/season";
import styles from './Team.module.css'
import { getTeam } from "stores/teams/async-actions";
import { selectCurrentTeam } from "stores/teams";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import { convertMoney } from "shared/MoneyCoverter";
import { ITeamBudgetHistoryItemResponse } from "models/ITeamResponse";
import { IBudgetType } from "models/IBudgetType";

const { Text, Title } = Typography;

const Team = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentTeam = useSelector(selectCurrentTeam);
    const storageUrl = useSelector(selectStorageUrl);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            dispatch(getTeam({
                teamId: id
            }));
        }
    }, [searchParams]);

    const getBudgetType = (historyItem: ITeamBudgetHistoryItemResponse) => {
        switch (historyItem.type) {
            case IBudgetType.Start:
                return <span>Start budget</span>;
            case IBudgetType.Invite:
                return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>Invited player</span>
                    <PlayerItem id={historyItem.invitedPlayerId as number} name={historyItem.invitedPlayerNickname as string} />
                </div>;
            case IBudgetType.Leave:
                return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PlayerItem id={historyItem.invitedPlayerId as number} name={historyItem.invitedPlayerNickname as string} />
                    <span>left the team</span>
                </div>;
            case IBudgetType.Sell:
                return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PlayerItem id={historyItem.invitedPlayerId as number} name={historyItem.invitedPlayerNickname as string} />
                    <span>sold</span>
                </div>;
        }
    }

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
                <Title level={5}>PLAYERS</Title>
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
                <Title level={5} style={{ marginTop: 16 }}>BUDGET</Title>
                <List
                    itemLayout="horizontal"
                    bordered
                    dataSource={currentTeam.budgetHistory}
                    renderItem={(item, index) => (
                        <List.Item className={styles.budgetHistoryItem}>
                            <span>{getBudgetType(item)}</span>
                            <Tag color={item.change > 0 ? "success" : "error"}>{item.change > 0 ? "+" + convertMoney(item.change) : convertMoney(item.change)}</Tag>
                        </List.Item>
                    )}
                />
            </Col>
        </Row >
    ) : <div />
}

export default Team;