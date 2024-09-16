import { Col, List, Progress, Row, Tag, Typography } from "antd";
import { WeeklyTourneyState } from "models/IWeelkyTourneyResponse";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertDate, convertFullDate, convertFullDateWithDate } from "shared/DateConverter";
import PlayerItem from "shared/PlayerItem";
import { selectWeeklyTourney, selectWeeklyTourneys } from "stores/weekly-tourney";

const { Text, Title } = Typography;

const WeeklyTourneyCard = () => {
    const navigate = useNavigate();

    const weeklyTourneys = useSelector(selectWeeklyTourneys);

    const [height, setHeight] = useState<number>(250);

    useEffect(() => {
        setHeightAction();
        window.addEventListener('resize', setHeightAction, true);
    }, [])

    const setHeightAction = () => {
        const gc = document.getElementById("stats-container");
        if (gc) {
            let h = gc.clientHeight - 64;
            setHeight(h);
        }
    }

    const getWTState = (state: WeeklyTourneyState) => {
        switch (state) {
            case WeeklyTourneyState.Canceled:
                return <Tag color="warning">Canceled</Tag>
            case WeeklyTourneyState.Registration:
                return <Tag color="processing">Registration</Tag>
            case WeeklyTourneyState.Running:
                return <Tag color="success">Running</Tag>
            case WeeklyTourneyState.Finished:
                return <Tag >Ended</Tag>
            default:
                return <div />
        }
    }

    return (
        <>
            <Row style={{ height: "100%", padding: isMobile ? 16 : 0 }}>
                <Col span={24} >
                    <Title level={5} style={{ display: "flex", alignItems: "center" }}>
                        Weekly tourneys
                    </Title>
                </Col>
                <Col span={24} style={{ height: "calc(-38px + 100%)" }}>
                    <List
                        itemLayout="horizontal"
                        style={{ height: "100%", overflow: "auto" }}
                        dataSource={weeklyTourneys}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[
                                    getWTState(item.state)
                                ]}
                                onClick={() => navigate("/weekly-tourney?id=" + item.id)}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </>
    )
}

export default WeeklyTourneyCard;

