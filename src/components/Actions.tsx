import { Button, Card } from "antd";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import Rules from "./Rules";

const Actions = () => {
    const [rulesOpen, setRulesOpen] = useState(false);

    return (
        <>
            <Button size="large" onClick={() => setRulesOpen(true)}>Rules</Button>
            <Rules open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </>
    )
}

export default Actions;