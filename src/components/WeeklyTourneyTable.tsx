import { Card, Col, Divider, Radio, Row, Skeleton, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectWeeklyTourney } from "stores/weekly-tourney";
import styles from './WeeklyTourneyTable.module.css'
import { max, uniq } from "lodash";
import _ from "lodash";
import WTTeam, { PlayerItemType } from "shared/WTTeam";
import { isMobile } from "react-device-detect";
import SingleEliminationBracket from "shared/Brackets/SingleElimBasket";
import { getCalculatedStyles } from "shared/Brackets/settings";
import { calculateSVGDimensions } from "shared/Brackets/calculate-svg-dimensions";
import PlayerItem from "shared/PlayerItem";

const { Text, Title } = Typography;

const enum SelectedTab {
    Brackets,
    Teams
}

const WeeklyTourneyTable = () => {
    const weeklyTourney = useSelector(selectWeeklyTourney);

    const [selectedTab, setSelectedTab] = useState<SelectedTab>(SelectedTab.Brackets);


    const legend = (round: number) => {
        const maxRound = _.max(weeklyTourney.tourney?.games.map(x => x.playoffType));
        const items = ["1/32", "1/16", "1/8", "1/4", "Semifinal", "Final"];
        return items.slice(-(maxRound ?? 0))[round - 1];
    }

    const matches = useMemo(() => {
        const games = weeklyTourney.tourney?.games.map(game => {
            return {
                id: game.id,
                tournamentRoundText: legend(game.playoffType),
                nextMatchId: game.nextGameId,
                participants: [
                    {
                        id: game.redTeamId,
                        name: game.redTeamName,
                        isWinner: false,
                        score: game.redScore
                    },
                    {
                        id: game.blueTeamId,
                        name: game.blueTeamName,
                        isWinner: false,
                        score: game.blueScore
                    }
                ]
            }
        })

        return games;
    }, [weeklyTourney.tourney?.games])

    const match = (data: any) => {
        return <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className={styles.game}>
                <div className={styles.teamWithScore + " " + (data.match.participants[0].isWinner ? styles.winner : styles.loser) + " " + styles.red}>
                    {data.match.participants[0].id &&
                        <>
                            <WTTeam id={data.match.participants[0].id} name={data.match.participants[0].name} crossed={!data.match.participants[0].isWinner} />
                            {(data.match.participants[0].score !== 0 || data.match.participants[1].score !== 0) &&
                                <Title level={5}>{data.match.participants[0].score}</Title>
                            }
                        </>
                    }
                    {!data.match.participants[0].id &&
                        <div className={styles.emptyTeam} style={{ width: Math.random() * (250 - 150) + 150 }} />
                    }

                </div>
                <div className={styles.teamWithScore + " " + (data.match.participants[1].isWinner ? styles.winner : styles.loser) + " " + styles.blue}>
                    {data.match.participants[1].id &&
                        <>
                            <WTTeam id={data.match.participants[1].id} name={data.match.participants[1].name} crossed={!data.match.participants[1].isWinner} />
                            {(data.match.participants[0].score !== 0 || data.match.participants[1].score !== 0) &&
                                <Title level={5}>{data.match.participants[1].score}</Title>
                            }
                        </>
                    }
                    {!data.match.participants[1].id &&
                        <div className={styles.emptyTeam} style={{ width: Math.random() * (250 - 150) + 150 }} />
                    }
                </div>
            </div>
        </div>
    }

    const content = useMemo(() => {
        switch (selectedTab) {
            case SelectedTab.Brackets:
                return <SingleEliminationBracket
                    matches={matches}
                    matchComponent={match}
                />
            case SelectedTab.Teams:
                return <Row gutter={[16, 16]}>
                    {weeklyTourney.tourney?.teams.map(team => {
                        return <Col sm={12} xs={24} md={8} lg={6}>
                            <Card title={<WTTeam id={team.id} name={team.name} />}>
                                <div style={{ padding: 16 }}>
                                    {team.players.map(player => {
                                        return <PlayerItem id={player.id} name={player.name} />
                                    })}
                                </div>
                            </Card>
                        </Col>
                    })}
                </Row>
        }
    }, [weeklyTourney, selectedTab, matches, match])

    return (
        <div style={{ height: "100%" }} id={"wt-table"}>
            <Row>
                <Col span={12}>
                    <Title level={3}>{weeklyTourney.tourney?.tourneyName}</Title>
                </Col>
                <Col span={12} className="right-align">
                    <Radio.Group options={[
                        {
                            label: "Playoff",
                            value: SelectedTab.Brackets
                        },
                        {
                            label: "Teams",
                            value: SelectedTab.Teams
                        },
                    ]} onChange={(e) => setSelectedTab(e.target.value)} value={selectedTab} optionType="button" />
                </Col>
            </Row>

            <br />
            <div style={{ width: "100%", height: "calc(-46px + 100%)", overflow: "auto", textAlign: "center" }}>
                {content}
            </div>
        </div>
    )
}

export default WeeklyTourneyTable;