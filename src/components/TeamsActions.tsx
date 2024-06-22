import { Popover, List, Tag, Dropdown, Button, Input, Form, Typography, MenuProps } from "antd"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { convertMoney } from "shared/MoneyCoverter"
import TeamItem from "shared/TeamItem"
import { selectTeamsState } from "stores/teams"
import styles from './Teams.module.css'
import { IBudgetType } from "models/IBudgetType"
import { ITeamsStateCurrentTeamBudgetHistoryResponse } from "models/ITeamsStateResponse"
import PlayerItem from "shared/PlayerItem"
import { UsergroupAddOutlined, MoreOutlined } from "@ant-design/icons";
import modal from "antd/es/modal"
import { useAppDispatch } from "hooks/useAppDispatch"
import { useNavigate } from "react-router-dom"
import { leaveTeam, getTeamsState, createTeam } from "stores/teams/async-actions"

const { Text, Title } = Typography;

const TeamsActions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const teamsState = useSelector(selectTeamsState);

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

    const onCreateTeam = (values: any) => {
        dispatch(createTeam(values)).unwrap().then(() => {
            dispatch(getTeamsState())
        })
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
    return teamsActions
}

export default TeamsActions;