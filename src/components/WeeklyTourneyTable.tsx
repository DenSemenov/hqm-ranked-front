import { Card, Col, Divider, message, notification, Radio, Row, Skeleton, Typography } from "antd";
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
import { WeeklyTourneyState } from "models/IWeelkyTourneyResponse";
import { TfiCup } from "react-icons/tfi";

const { Text, Title } = Typography;

const enum SelectedTab {
    Brackets,
    Teams
}

const WeeklyTourneyTable = () => {
    const weeklyTourney = useSelector(selectWeeklyTourney);

    const [selectedTab, setSelectedTab] = useState<SelectedTab>(SelectedTab.Brackets);
    const [notificationShowed, setNotificationShowed] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();

    const legend = (round: number) => {
        const maxRound = _.max(weeklyTourney.tourney?.games.map(x => x.playoffType));
        const items = ["1/32", "1/16", "1/8", "1/4", "Semifinal", "Final"];
        return items.slice(-(maxRound ?? 0))[round - 1];
    }

    useEffect(() => {
        if (weeklyTourney.state === WeeklyTourneyState.Finished && !notificationShowed) {
            const lastGame = weeklyTourney.tourney?.games.find(x => !x.nextGameId);
            if (lastGame) {
                const winnerId = lastGame.redScore > lastGame.blueScore ? lastGame.redTeamId : lastGame.blueTeamId;
                const winnerName = lastGame.redScore > lastGame.blueScore ? lastGame.redTeamName : lastGame.blueTeamName;
                const players = weeklyTourney.tourney?.teams.find(x => x.id === winnerId)?.players;

                api.info({
                    message: "Congratulations to the winner",
                    description: <div style={{ display: "flex", flexDirection: "column", gap: 4, marginRight: 32 }}>
                        <Divider />
                        <WTTeam id={winnerId} name={winnerName} />
                        <Divider />
                        {players?.map(player => {
                            return <PlayerItem id={player.id} name={player.name} />
                        })}
                    </div>,
                    icon: <TfiCup color={"gold"} />,
                    closable: false,

                    placement: "bottom"
                });
                setNotificationShowed(true);
            }
        }
    }, [weeklyTourney]);


    const matches = useMemo(() => {
        const games = weeklyTourney.tourney?.games.map(game => {
            return {
                id: game.id,
                tournamentRoundText: legend(game.playoffType),
                nextMatchId: game.nextGameId,
                state: game.state,
                round: game.playoffType,
                participants: [
                    {
                        id: game.redTeamId,
                        name: game.redTeamName,
                        isWinner: game.redScore > game.blueScore && game.state === "Ended",
                        score: game.redScore
                    },
                    {
                        id: game.blueTeamId,
                        name: game.blueTeamName,
                        isWinner: game.redScore < game.blueScore && game.state === "Ended",
                        score: game.blueScore
                    }
                ]
            }
        })

        return games;
    }, [weeklyTourney.tourney?.games])

    const match = (data: any) => {
        const maxRound = _.max(weeklyTourney.tourney?.games.map(x => x.playoffType));
        const winnerStyle = data.match.round === maxRound ? styles.winnerAll : styles.winner;
        const loserStyle = data.match.state === "Ended" ? styles.retired : styles.loser;

        return <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className={styles.game}>
                <div className={styles.teamWithScore + " " + (data.match.participants[0].isWinner ? winnerStyle : loserStyle) + " " + styles.red}>
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
                <div className={styles.teamWithScore + " " + (data.match.participants[1].isWinner ? winnerStyle : loserStyle) + " " + styles.blue}>
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
                <div className={styles.state}>
                    {data.match.state}
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
                                    <Row gutter={[8, 8]}>
                                        <Col span={12} className="left-align">
                                            Player
                                        </Col>
                                        <Col span={3} className="flex-center">
                                            GP
                                        </Col>
                                        <Col span={3} className="flex-center">
                                            G
                                        </Col>
                                        <Col span={3} className="flex-center">
                                            A
                                        </Col>
                                        <Col span={3} className="flex-center">
                                            P
                                        </Col>
                                        {_.orderBy(team.players, "points", "desc").map(player => {
                                            return <>
                                                <Col span={12} className="left-align">
                                                    <PlayerItem id={player.id} name={player.name} />
                                                </Col>
                                                <Col span={3} className="flex-center">
                                                    {player.gp}
                                                </Col>
                                                <Col span={3} className="flex-center">
                                                    {player.goals}
                                                </Col>
                                                <Col span={3} className="flex-center">
                                                    {player.assists}
                                                </Col>
                                                <Col span={3} className="flex-center">
                                                    {player.points}
                                                </Col>
                                            </>
                                        })}
                                    </Row>
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
            {contextHolder}
        </div>
    )
}

export default WeeklyTourneyTable;