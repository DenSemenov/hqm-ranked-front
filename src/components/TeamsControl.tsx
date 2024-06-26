import { Card } from "antd";
import TeamsActions from "./TeamsActions";
import TeamsGames from "./TeamsGames";

const TeamsControl = () => {
    return (
        <>
            <Card style={{ padding: 8, margin: "16px" }}>
                <TeamsActions />
            </Card>
            <TeamsGames />
        </>
    )
}

export default TeamsControl;