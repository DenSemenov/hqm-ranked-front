import { Table } from "antd"
import { isMobile } from "react-device-detect"
import PlayerItem from "shared/PlayerItem"
import StoriesComponent from "./Stories"
import { useEffect, useState } from "react"
import { selectTeamsStats } from "stores/teams"
import { useSelector } from "react-redux"
import TeamItem from "shared/TeamItem"

const TeamsTable = () => {
    const currentTeamsStats = useSelector(selectTeamsStats);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        const playerCard = document.getElementById("playerCard");
        if (playerCard) {
            let h = playerCard.clientHeight - 54;
            setHeight(h);
        }

    }
    return (
        <>
            {isMobile &&
                <div style={{ padding: 8 }}>
                    <StoriesComponent />
                </div>
            }
            <Table
                dataSource={currentTeamsStats}
                bordered={false}
                scroll={{
                    y: !isMobile ? height : undefined
                }}
                rowKey={"nickname"}
                pagination={false}
                columns={[
                    {
                        title: "#",
                        width: 70,
                        dataIndex: "place",
                        sorter: (a, b) => a.place - b.place,
                        render(value, record, index) {
                            return value
                        },
                    },
                    {
                        title: "TEAM",
                        width: 160,
                        dataIndex: "team",
                        ellipsis: true,
                        fixed: "left",
                        render(value, record, index) {
                            return <TeamItem id={record.id} name={record.name} />
                        },
                    },
                    {
                        title: "GP",
                        width: 90,
                        align: "right",
                        dataIndex: "g",
                        sorter: (a, b) => (a.win + a.lose) - (b.win + b.lose),
                        render(value, record, index) {
                            return record.win + record.lose
                        },
                    },
                    {
                        title: "WIN",
                        width: 90,
                        align: "right",
                        sorter: (a, b) => a.win - b.win,
                        dataIndex: "win"
                    },
                    {
                        title: "LOSE",
                        width: 90,
                        align: "right",
                        sorter: (a, b) => a.lose - b.lose,
                        dataIndex: "lose"
                    },
                    {
                        title: "WINRATE",
                        width: 90,
                        align: "right",
                        dataIndex: "winrate",
                        sorter: (a, b) => (Math.round(a.win / (a.win + a.lose) * 100 * 100)) - (Math.round(b.win / (b.win + b.lose) * 100 * 100)),
                        render(value, record, index) {
                            return Math.round(record.win / (record.win + record.lose) * 100 * 100) / 100 + "%"
                        },
                    },
                    {
                        title: "GF",
                        width: 70,
                        align: "right",
                        sorter: (a, b) => a.goals - b.goals,
                        dataIndex: "goals"
                    },
                    {
                        title: "GA",
                        width: 70,
                        align: "right",
                        sorter: (a, b) => a.goalsConceded - b.goalsConceded,
                        dataIndex: "goalsConceded"
                    },
                    {
                        title: "RATING",
                        width: 120,
                        align: "right",
                        dataIndex: "rating",
                        sorter: (a, b) => a.rating - b.rating,
                        fixed: "right",
                    },
                ]}
            />
        </>
    )
}

export default TeamsTable;