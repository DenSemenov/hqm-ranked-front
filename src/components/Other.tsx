import { isMobile } from "react-device-detect";
import Events from "./Events";
import Actions from "./Actions";
import DailyStats from "./DailyStats";
import WeekyStats from "./WeeklyStats";
import WeeklyTourneyCard from "./WeeklyTourneyCard";
import { Divider } from "antd";

const Other = () => {

    return (
        <div style={{ padding: isMobile ? 16 : 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <Events />
            <Divider />
            <WeeklyTourneyCard />
            <Divider />
            <DailyStats />
            <Divider />
            <WeekyStats />
            <Divider />
            <Actions />
        </div>

    )
}

export default Other;