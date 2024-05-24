import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentSeasonStats } from "stores/season";
import { isMobile } from "react-device-detect";
import PlayerItem from "shared/PlayerItem";
import StoriesComponent from "./Stories";


const PlayersTable = () => {
    const currentSeasonStats = useSelector(selectCurrentSeasonStats);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        const playerCard = document.getElementById("playerCard");
        if (playerCard) {
            let h = playerCard.clientHeight - 37;
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
                dataSource={currentSeasonStats}
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
                        render(value, record, index) {
                            return currentSeasonStats.indexOf(record) + 1
                        },
                    },
                    {
                        title: "NICKNAME",
                        width: 160,
                        dataIndex: "nickname",
                        ellipsis: true,
                        fixed: "left",
                        render(value, record, index) {
                            return <PlayerItem id={record.playerId} name={record.nickname} />
                        },
                    },
                    {
                        title: "G",
                        width: 90,
                        align: "right",
                        dataIndex: "g",
                        render(value, record, index) {
                            return record.win + record.lose
                        },
                    },
                    {
                        title: "WIN",
                        width: 90,
                        align: "right",
                        dataIndex: "win"
                    },
                    {
                        title: "LOSE",
                        width: 90,
                        align: "right",
                        dataIndex: "lose"
                    },
                    {
                        title: "WINRATE",
                        width: 90,
                        align: "right",
                        dataIndex: "winrate",
                        render(value, record, index) {
                            return Math.round(record.win / (record.win + record.lose) * 100 * 100) / 100 + "%"
                        },
                    },
                    {
                        title: "G",
                        width: 70,
                        align: "right",
                        dataIndex: "goals"
                    },
                    {
                        title: "GPG",
                        width: 70,
                        align: "right",
                        dataIndex: "gpg",
                        render(value, record, index) {
                            return Math.floor(record.goals / (record.win + record.lose) * 100) / 100
                        },
                    },
                    {
                        title: "A",
                        width: 70,
                        align: "right",
                        dataIndex: "assists"
                    },
                    {
                        title: "APG",
                        width: 70,
                        align: "right",
                        dataIndex: "gpg",
                        render(value, record, index) {
                            return Math.floor(record.assists / (record.win + record.lose) * 100) / 100
                        },
                    },
                    {
                        title: "MVP",
                        width: 90,
                        align: "right",
                        dataIndex: "mvp"
                    },

                    {
                        title: "MVP %",
                        width: 70,
                        align: "right",
                        dataIndex: "gpg",
                        render(value, record, index) {
                            return Math.floor(record.mvp / (record.win + record.lose) * 100) / 100
                        },
                    },
                    {
                        title: "RATING",
                        width: 120,
                        align: "right",
                        dataIndex: "rating",
                        fixed: "right",
                    },
                ]}
            />
        </>
    )
}

export default PlayersTable;