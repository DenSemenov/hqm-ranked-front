import { Button, Card } from "antd";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import Rules from "./Rules";

const Actions = () => {
    const [rulesOpen, setRulesOpen] = useState(false);

    return (
        <Card bordered={false} style={{ height: !isMobile ? 336 : undefined, width: "100%" }}>

            <Button size="large" onClick={() => setRulesOpen(true)}>Rules</Button>
            <Rules open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </Card>
    )
}

export default Actions;