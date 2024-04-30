import { Button, Card } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import Rules from "./Rules";

const Actions = () => {
    const dispatch = useAppDispatch();

    const [rulesOpen, setRulesOpen] = useState(false);

    return (
        <Card bordered={false} style={{ height: !isMobile ? 92 : undefined, width: "100%" }}>
            <Button size="large" onClick={() => setRulesOpen(true)}>Rules</Button>
            <Rules open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </Card>
    )
}

export default Actions;