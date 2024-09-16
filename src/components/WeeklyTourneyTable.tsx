import { Divider, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectWeeklyTourney } from "stores/weekly-tourney";
import styles from './WeeklyTourneyTable.module.css'
import TeamItem from "shared/TeamItem";
import WTTeam from "shared/WTTeam";

const { Text, Title } = Typography;

const WeeklyTourneyTable = () => {
    const weeklyTourney = useSelector(selectWeeklyTourney);

    const rounds = useMemo(() => {
        const r = weeklyTourney.tourney ? weeklyTourney.tourney.rounds : 0;
        let rr: number[] = [];
        for (let i = 0; i < r; i++) {
            rr.push(i);
        }
        return rr;
    }, [weeklyTourney.tourney?.rounds])

    return (
        <div style={{ height: "100%" }}>
            <Title level={3}>{weeklyTourney.tourney?.tourneyName}</Title>
            <div style={{ height: "calc(-32px + 100%)", width: "100%", overflow: "auto", display: "flex", gap: 32, padding: 32 }}>
                {/* {rounds.map(rnd => {
                    return <div className={styles.round} style={{ width: 100 / rounds.length + "%" }}>
                        {weeklyTourney.tourney?.games.filter(x => x.playoffType === rnd).map(x => {
                            return <div className={styles.game}>
                                <WTTeam id={x.redTeamId} name={x.redTeamName} />
                                <Divider style={{ margin: "16px 0" }} />
                                <WTTeam id={x.blueTeamId} name={x.blueTeamName} />
                            </div>
                        })}
                    </div>
                })} */}
            </div>
        </div>
    )
}

export default WeeklyTourneyTable;