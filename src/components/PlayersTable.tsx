import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentSeasonStats } from "stores/season";
import PlayersTableModal from "./PlayersTableModal";
import { isMobile } from "react-device-detect";
import PlayerItem from "shared/PlayerItem";

interface IProps {
    full: boolean;
}

const PlayersTable = ({ full }: IProps) => {
    const currentSeasonStats = useSelector(selectCurrentSeasonStats);

    const [height, setHeight] = useState<number>(0);
    const [playersModalOpen, setPlayersModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 42 - 32 - 16 * 2;
        setHeight(h);
    }

    const onClosePlayersTableModal = () => {
        setPlayersModalOpen(false);
    }

    return (
        <>
            <Card title={!isMobile ? "Players" : undefined} bodyStyle={{ padding: 0 }} bordered={false} style={{ height: !isMobile ? height : undefined, width: "100%" }}>
                <Table
                    dataSource={currentSeasonStats}
                    bordered={false}
                    scroll={{
                        y: !isMobile ? height - 56 : undefined
                    }}
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
                            width: 200,
                            dataIndex: "nickname",
                            ellipsis: true,
                            fixed: "left",
                            render(value, record, index) {
                                return <PlayerItem id={record.playerId} name={record.nickname} />
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
                            title: "G",
                            width: 70,
                            align: "right",
                            dataIndex: "goals"
                        },
                        {
                            title: "A",
                            width: 70,
                            align: "right",
                            dataIndex: "assists"
                        },
                        {
                            title: "MVP",
                            width: 90,
                            align: "right",
                            dataIndex: "mvp"
                        },
                        {
                            title: "RATING",
                            width: 120,
                            align: "right",
                            dataIndex: "rating"
                        },
                    ]}
                />
            </Card>

            <PlayersTableModal open={playersModalOpen} onClose={onClosePlayersTableModal} />
        </>
    )
}

export default PlayersTable;