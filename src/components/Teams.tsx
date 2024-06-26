import { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import TeamsTable from "./TeamsTable";
import { Card, Col, Modal, Row } from "antd";
import Servers from "./Servers";
import Actions from "./Actions";
import StoriesComponent from "./Stories";
import { useAppDispatch } from "hooks/useAppDispatch";
import { getTeamsState, getTeamsStats, getTransferMarket } from "stores/teams/async-actions";
import { selectTeamsState } from "stores/teams";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TeamsGames from "./TeamsGames";
import { selectCurrentSeason } from "stores/season";
import TeamsActions from "./TeamsActions";

const Teams = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentSeason = useSelector(selectCurrentSeason);
    const teamsState = useSelector(selectTeamsState);

    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        dispatch(getTeamsState())
        dispatch(getTransferMarket())
        if (currentSeason) {
            dispatch(getTeamsStats({
                offset: 0,
                seasonId: currentSeason
            }))
        }
    }, [currentSeason])

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
                            <Card style={{ height: "100%", padding: 12 }}>
                                <TeamsActions />
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
    }, [isMobile])

    return content
}

export default Teams;