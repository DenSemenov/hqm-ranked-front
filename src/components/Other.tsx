import { Typography, Card, Carousel, Tabs } from "antd";
import { isMobile } from "react-device-detect";
import Events from "./Events";
import Actions from "./Actions";
import Servers from "./Servers";

const Other = () => {

    return (
        <Tabs
            style={{ height: !isMobile ? 392 : undefined, width: "100%", }}
            type="card"
            items={[
                {
                    label: "Servers",
                    key: "servers",
                    children: <Servers />
                },
                {
                    label: "Daily event",
                    key: "event",
                    children: <Events />
                },
                {
                    label: "Actions",
                    key: "rules",
                    children: <Actions />
                },
            ]}
        />
    )
}

export default Other;