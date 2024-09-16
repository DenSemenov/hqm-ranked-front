import { Card, Carousel, Col, Row } from "antd";
import PlayersTable from "./PlayersTable";
import Games from "./Games";
import { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import Events from "./Events";
import Servers from "./Servers";
import Actions from "./Actions";
import StoriesComponent from "./Stories";
import DailyStats from "./DailyStats";
import WeekyStats from "./WeeklyStats";
import WeeklyTourneyCard from "./WeeklyTourneyCard";
import { selectCurrentWeeklyTourney } from "stores/weekly-tourney";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const currentWeeklyTourney = useSelector(selectCurrentWeeklyTourney);

    useEffect(() => {
        if (currentWeeklyTourney) {
            // navigate("/weekly-tourney?id=" + currentWeeklyTourney)
        }
    }, [currentWeeklyTourney])

    const content = useMemo(() => {
        if (isMobile) {
            return <div><PlayersTable /></div>
        } else {
            return <Row gutter={[16, 16]} style={{ height: "100%" }}>
                <Col span={14} style={{ height: "100%" }}>
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col span={24} style={{ height: "calc(-16px + 70%)" }}>
                            <Card style={{ height: "100%" }} id="playerCard">
                                <PlayersTable />
                            </Card>
                        </Col>
                        <Col span={12} style={{ height: "calc(-16px + 30%)" }} >
                            <Card style={{ height: "100%", padding: 16 }} >
                                <Servers />
                            </Card>
                        </Col>
                        <Col span={12} style={{ height: "calc(-16px + 30%)" }} >
                            <Card style={{ height: "100%", padding: 16 }} >
                                <Actions />
                            </Card>
                        </Col>
                    </Row>

                </Col>
                <Col span={10} style={{ height: "100%" }}>
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col span={24} style={{ height: 80 }}>
                            <Card style={{ height: "100%", padding: 16 }}>
                                <StoriesComponent />
                            </Card>
                        </Col>
                        <Col span={24} style={{ height: "calc(-118px + 70%)" }} >
                            <Card style={{ height: "100%" }} title="GAMES">
                                <Games />
                            </Card>
                        </Col>
                        <Col span={24} style={{ height: "calc(-16px + 30%)" }} >
                            <Card style={{ height: "100%", padding: 16 }} id="stats-container" >
                                <Carousel style={{ height: "100%", padding: isMobile ? 16 : 0 }} fade waitForAnimate autoplay>
                                    <Events />
                                    <WeeklyTourneyCard />
                                    <DailyStats />
                                    <WeekyStats />
                                </Carousel>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        }
    }, [isMobile])

    return content
}

export default HomePage;