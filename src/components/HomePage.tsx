import { Card, Col, Flex, Row } from "antd";
import PlayersTable from "./PlayersTable";
import Games from "./Games";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import Events from "./Events";
import Servers from "./Servers";
import Actions from "./Actions";
import StoriesComponent from "./Stories";

const HomePage = () => {

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
                        <Col span={24} style={{ height: 80 }}>
                            <Card style={{ height: "100%", padding: 16 }}>
                                <StoriesComponent />
                            </Card>
                        </Col>
                        <Col span={24} style={{ height: "calc(-118px + 70%)" }} >
                            <Card style={{ height: "100%" }}>
                                <Games />
                            </Card>
                        </Col>
                        <Col span={24} style={{ height: "calc(-16px + 30%)" }} >
                            <Card style={{ height: "100%", padding: 16 }}>
                                <Events />
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