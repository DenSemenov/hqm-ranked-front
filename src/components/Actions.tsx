import { Button, Card } from "antd";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import Rules from "./Rules";
import { useNavigate } from "react-router-dom";

const Actions = () => {
    const navigate = useNavigate();

    const [rulesOpen, setRulesOpen] = useState(false);

    return (
        <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Button size="large" type="primary" onClick={() => setRulesOpen(true)}>Rules</Button>
            <Button size="large" onClick={() => navigate("/top")}>Top stats</Button>
            <Rules open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </div>
    )
}

export default Actions;