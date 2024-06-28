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
import { selectLoading, setLoading } from "stores/season"
import Budget from "./Budget"

const { Text, Title } = Typography;

const TeamsActions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const teamsState = useSelector(selectTeamsState);
    const loading = useSelector(selectLoading);

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
            dispatch(setLoading(false))
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
                        content={<Budget items={teamsState.team.budgetHistory} />}
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
                                <Button type="primary" htmlType="submit" loading={loading} >
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
    }, [teamsState, loading])
    return teamsActions
}

export default TeamsActions;