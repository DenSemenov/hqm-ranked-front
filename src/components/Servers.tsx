import { Card, Col, Row, Tag, Typography } from "antd";
import { IActiveServerResponse } from "models/IActiveServerResponse";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { selectServers } from "stores/server";

const { Text, Title } = Typography;

const Servers = () => {

    const servers = useSelector(selectServers);

    const getStateById = (state: number) => {
        let text = "";

        switch (state) {
            case 0:
                text = "Waiting";
                break;
            case 1:
                text = "Pick";
                break;
            case 2:
                text = "Game";
                break;
        }

        return <Tag>{text}</Tag>
    }

    const getPeriodWithTime = (period: number, time: number) => {
        let p = period + " period";
        if (period > 3) {
            p = "OT";
        }

        const m = Math.floor(time / 100 / 60);
        const s = time / 100 - m * 60;

        let secString = Math.round(s).toString();

        if (secString.length === 1) {
            secString = "0" + secString;
        }

        return p + " " + m + ":" + secString;
    }

    const getBodyByStateId = (server: IActiveServerResponse) => {
        switch (server.state) {
            case 0:
                return <div>
                    <Text type="secondary">Logged in</Text>
                    <Title level={5}>{server.loggedIn + " / " + server.teamMax * 2}</Title>
                </div>
            case 1:
                return <div>
                    <Title level={5}>Pick</Title>
                </div>
            case 2:
                return <div>
                    <Text type="secondary">{getPeriodWithTime(server.period, server.time)}</Text>
                    <Title level={5}>{server.redScore + " - " + server.blueScore}</Title>
                </div>
        }
    }

    return (
        <Card bordered={false} style={{ height: !isMobile ? 336 : undefined, width: "100%" }}>
            <Row gutter={[16, 16]}>
                {servers.map(server => {
                    return <Col sm={12} xs={24} key={server.id} >
                        <Card title={server.name} style={{ width: "100%" }} extra={getStateById(server.state)}>
                            {getBodyByStateId(server)}
                        </Card>
                    </Col>
                })}
            </Row>
        </Card>
    )
}

export default Servers;