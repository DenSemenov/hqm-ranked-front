import { Card, Carousel, Col, Row, Tag, Typography } from "antd";
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
                return <>
                    <Text type="secondary">Logged in</Text>
                    <Title level={3}>{server.loggedIn + " / " + server.teamMax * 2}</Title>
                </>
            case 1:
                return <Title level={3}>Pick</Title>
            case 2:
                return <>
                    <Text type="secondary">{getPeriodWithTime(server.period, server.time)}</Text>
                    <Title level={3}>{server.redScore + " - " + server.blueScore}</Title>
                </>
        }
    }

    return (
        <Carousel style={{ height: "calc(-24px + 100%)", padding: isMobile ? 16 : 0 }} fade waitForAnimate >
            {servers.map(server => {
                return <><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Title level={3}>{server.name}</Title>
                    {getStateById(server.state)}
                </div>
                    <div style={{ height: "calc(-68px + 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        {getBodyByStateId(server)}
                    </div>
                </>
            })}
        </Carousel>
    )
}

export default Servers;