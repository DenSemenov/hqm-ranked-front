import { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import TeamsTable from "./TeamsTable";
import { Button, Card, Col, Dropdown, Form, Input, List, MenuProps, Modal, Popover, Row, Tag, Typography } from "antd";
import Servers from "./Servers";
import Actions from "./Actions";
import StoriesComponent from "./Stories";
import { UsergroupAddOutlined, MoreOutlined } from "@ant-design/icons";
import styles from './Teams.module.css'
import { convertMoney } from "shared/MoneyCoverter";
import { useAppDispatch } from "hooks/useAppDispatch";
import { createTeam, getTeamsState, leaveTeam } from "stores/teams/async-actions";
import { selectTeamsState } from "stores/teams";
import { useSelector } from "react-redux";
import TeamItem from "shared/TeamItem";
import { ITeamsStateCurrentTeamBudgetHistoryResponse } from "models/ITeamsStateResponse";
import { IBudgetType } from "models/IBudgetType";
import PlayerItem from "shared/PlayerItem";
import { useNavigate } from "react-router-dom";
import TeamsGames from "./TeamsGames";

const { Text, Title } = Typography;

const Teams = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const teamsState = useSelector(selectTeamsState);

    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        dispatch(getTeamsState())
    }, [])

    const onCreateTeam = (values: any) => {
        dispatch(createTeam(values)).unwrap().then(() => {
            dispatch(getTeamsState())
        })
    }

    const getBudgetType = (historyItem: ITeamsStateCurrentTeamBudgetHistoryResponse) => {
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

    const actions = useMemo(() => {
        let items: MenuProps['items'] = [];

        if (teamsState.isCaptain || teamsState.isAssistant) {
            items.push({
                key: "teamsettings",
                label: "Team settings"
            })
        }

        items.push({
            key: "leave",
            label: "Leave"
        })

        return items;
    }, [teamsState])

    const onLeaveTeam = () => {
        dispatch(leaveTeam()).unwrap().then(() => {
            dispatch(getTeamsState())
        })
    }

    const onAction = async (info: any) => {
        switch (info.key) {
            case "leave":
                const confirmed = await modal.confirm({
                    title: "Are you sure you want to leave the team?",
                    okText: "Leave"
                });
                if (confirmed) {
                    onLeaveTeam();
                }
                break;
            case "teamsettings":
                navigate("/team-settings");
                break;
        }
    }

    const teamsActions = useMemo(() => {
        if (teamsState.team) {
            return <div className={styles.teamActions}>
                <TeamItem id={teamsState.team.id} name={teamsState.team.name} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Popover
                        title={"Budget history"}
                        content={<List
                            style={{ width: 400 }}
                            itemLayout="horizontal"
                            dataSource={teamsState.team.budgetHistory}
                            renderItem={(item, index) => (
                                <List.Item className={styles.budgetHistoryItem}>
                                    <span>{getBudgetType(item)}</span>
                                    <Tag color={item.change > 0 ? "success" : "error"}>{item.change > 0 ? "+" + convertMoney(item.change) : convertMoney(item.change)}</Tag>
                                </List.Item>
                            )}
                        />}
                    >
                        <Title level={4}>{convertMoney(teamsState.team.budget)}</Title>
                    </Popover>
                    <Dropdown menu={{ items: actions, onClick: onAction }} placement="bottomLeft">
                        <Button icon={<MoreOutlined />} type="text" />
                    </Dropdown>
                </div>
            </div>
        } else {
            return <div className={styles.teamActions}>
                <Popover
                    title="Create team"
                    content={
                        <Form
                            layout="vertical"
                            onFinish={onCreateTeam}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                            >
                                <Input />
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
                    <Button type={"primary"} icon={<UsergroupAddOutlined />} disabled={teamsState.canCreateTeam === false} >Create team</Button>
                </Popover>
            </div>
        }
    }, [teamsState])

    const content = useMemo(() => {
        if (isMobile) {
            return <TeamsTable />
        } else {
            return <Row gutter={[16, 16]} style={{ height: "100%" }}>
                <Col span={14} style={{ height: "100%" }}>
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col span={24} style={{ height: "calc(-16px + 70%)" }}>
                            <Card style={{ height: "100%" }} id="playerCard">
                                <TeamsTable />
                            </Card>
                        </Col>
                        <Col span={12} style={{ height: "calc(-16px + 30%)" }} >
                            <Card style={{ height: "100%", padding: 16 }}>
                                <Servers />
                            </Card>
                        </Col>
                        <Col span={12} style={{ height: "calc(-16px + 30%)" }} >
                            <Card style={{ height: "100%", padding: 16 }}>
                                <Actions />
                            </Card>
                        </Col>
                    </Row>

                </Col>
                <Col span={10} style={{ height: "100%" }}>
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col span={24} style={{ height: 62 }}>
                            <Card style={{ height: "100%", padding: 16 }}>
                                {teamsActions}
                            </Card>
                        </Col>
                        <Col span={24} style={{ height: 80 }}>
                            <Card style={{ height: "100%", padding: 16 }}>
                                <StoriesComponent />
                            </Card>
                        </Col>
                        <Col span={24} style={{ height: "calc(-198px + 100%)" }} >
                            <Card style={{ height: "100%" }}>
                                <TeamsGames />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                {contextHolder}
            </Row>
        }
    }, [isMobile, teamsActions])

    return content
}

export default Teams;