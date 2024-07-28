import { Badge, Button, Card } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Rules from "./Rules";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentMode } from "stores/season";
import { IInstanceType } from "models/IInstanceType";
import { useAppDispatch } from "hooks/useAppDispatch";
import { selectTransferMarkets } from "stores/teams";
import { getTransferMarket } from "stores/teams/async-actions";
import { selectWebsiteSettings } from "stores/auth";
import { FaDiscord } from "react-icons/fa";

const Actions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentMode = useSelector(selectCurrentMode);
    const transferMarkets = useSelector(selectTransferMarkets);
    const websiteSettings = useSelector(selectWebsiteSettings);

    useEffect(() => {
        dispatch(getTransferMarket())
    }, [])

    const [rulesOpen, setRulesOpen] = useState(false);

    return (
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", height: "100%", flexWrap: "wrap", alignContent: "center" }}>
            <Button size="large" type="primary" onClick={() => setRulesOpen(true)}>Rules</Button>
            {currentMode === IInstanceType.Teams &&
                <Link to={"/free-agents"}  >
                    <Button size="large" type="primary" >Free agents</Button>
                </Link>
            }
            {currentMode === IInstanceType.Teams &&
                <Badge count={transferMarkets.length}>
                    <Link to={"/transfer-market"}  >
                        <Button size="large" type="primary" >Transfer market</Button>
                    </Link>
                </Badge>
            }
            <Link to={"/top"}  >
                <Button size="large" >Top stats</Button>
            </Link>
            <Link to={"/map"}  >
                <Button size="large" >Map</Button>
            </Link>
            {websiteSettings && websiteSettings.discordJoinLink &&
                <Link to={websiteSettings.discordJoinLink} target="_blank" rel="noopener noreferrer" >
                    <Button size="large" type="dashed" icon={<FaDiscord />} >Discord</Button>
                </Link>
            }
            <Rules open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </div>
    )
}

export default Actions;