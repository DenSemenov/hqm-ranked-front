import { Badge, Button, Card } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Rules from "./Rules";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentMode } from "stores/season";
import { IInstanceType } from "models/IInstanceType";
import { useAppDispatch } from "hooks/useAppDispatch";
import { selectTransferMarkets } from "stores/teams";
import { getTransferMarket } from "stores/teams/async-actions";

const Actions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentMode = useSelector(selectCurrentMode);
    const transferMarkets = useSelector(selectTransferMarkets);

    useEffect(() => {
        dispatch(getTransferMarket())
    }, [])

    const [rulesOpen, setRulesOpen] = useState(false);

    return (
        <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", height: "100%", flexWrap: "wrap" }}>
            <Button size="large" type="primary" onClick={() => setRulesOpen(true)}>Rules</Button>
            {currentMode === IInstanceType.Teams &&
                <Button size="large" type="primary" onClick={() => navigate("/free-agents")}>Free agents</Button>
            }
            {currentMode === IInstanceType.Teams &&
                <Badge count={transferMarkets.length}>
                    <Button size="large" type="primary" onClick={() => navigate("/transfer-market")}>Transfer market</Button>
                </Badge>
            }
            <Button size="large" onClick={() => navigate("/top")}>Top stats</Button>
            <Rules open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </div>
    )
}

export default Actions;