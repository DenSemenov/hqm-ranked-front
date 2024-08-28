import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentSeasonStats } from "stores/season";
import { isMobile } from "react-device-detect";
import PlayerItem from "shared/PlayerItem";
import StoriesComponent from "./Stories";
import { CaretUpOutlined, CaretDownOutlined, MinusOutlined } from "@ant-design/icons"
import { TbProgressHelp } from "react-icons/tb";

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
            let h = playerCard.clientHeight - 54;
            setHeight(h);
        }

    }

    const getChange = (change: number) => {
        if (change > 0) {
            return <CaretUpOutlined style={{ color: "#58ef7b" }} />
        } else if (change < 0) {
            return <CaretDownOutlined style={{ color: "#e95c5c" }} />
        } else if (change === 0) {
            return <MinusOutlined style={{ opacity: 0.2 }} />
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
                            if (record.isCalculated) {
                                return <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    {getChange(record.change)}
                                    {value}
                                </div>
                            } else {
                                return <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    {getChange(0)}
                                    <TbProgressHelp />
                                </div>
                            }
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
                        title: "G",
                        width: 70,
                        align: "right",
                        sorter: (a, b) => a.goals - b.goals,
                        dataIndex: "goals"
                    },
                    {
                        title: "GPG",
                        width: 70,
                        align: "right",
                        dataIndex: "gpg",
                        sorter: (a, b) => (Math.floor(a.goals / (a.win + a.lose) * 100) / 100) - (Math.floor(b.goals / (b.win + b.lose) * 100) / 100),
                        render(value, record, index) {
                            return Math.floor(record.goals / (record.win + record.lose) * 100) / 100
                        },
                    },
                    {
                        title: "A",
                        width: 70,
                        align: "right",
                        sorter: (a, b) => a.assists - b.assists,
                        dataIndex: "assists"
                    },
                    {
                        title: "APG",
                        width: 70,
                        align: "right",
                        dataIndex: "gpg",
                        sorter: (a, b) => (Math.floor(a.assists / (a.win + a.lose) * 100) / 100) - (Math.floor(b.assists / (b.win + b.lose) * 100) / 100),
                        render(value, record, index) {
                            return Math.floor(record.assists / (record.win + record.lose) * 100) / 100
                        },
                    },
                    {
                        title: "MVP",
                        width: 90,
                        align: "right",
                        sorter: (a, b) => a.mvp - b.mvp,
                        dataIndex: "mvp"
                    },

                    {
                        title: "MVP %",
                        width: 100,
                        align: "right",
                        dataIndex: "gpg",
                        sorter: (a, b) => (Math.floor(a.mvp / (a.win + a.lose) * 100)) - Math.floor(b.mvp / (b.win + b.lose) * 100),
                        render(value, record, index) {
                            return Math.floor(record.mvp / (record.win + record.lose) * 100) + "%"
                        },
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

export default PlayersTable;