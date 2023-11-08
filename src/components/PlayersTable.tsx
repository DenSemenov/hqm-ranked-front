import CardComponent, { EdgeType } from "shared/CardComponent";
import styles from './PlayersTable.module.css'
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentSeasonStats } from "stores/season";
import PlayersTableModal from "./PlayersTableModal";

interface IProps {
    full: boolean;
}

const PlayersTable = ({ full }: IProps) => {
    const currentSeasonStats = useSelector(selectCurrentSeasonStats);

    const [height, setHeight] = useState<number>(0);
    const [tableHeight, setTableHeight] = useState<number>(0);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const [playersModalOpen, setPlayersModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, []);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 142 - 32 - 100 - 32 * 2;

        h = full ? 700 : h;

        const th = h - 32 * 2 - 20 - 40 - 55 - 8;
        setHeight(h);
        setTableHeight(th);

        setItemsCount(Math.round(th / 60));
    }

    const onClosePlayersTableModal = () => {
        setPlayersModalOpen(false);
    }

    return (
        <div className={styles.playersTableContainer} style={{ height: height }}>
            <CardComponent edges={full ? [] : [EdgeType.LeftBottom, EdgeType.RightTop]}>
                <div className={styles.playersTableContent}>
                    {!full &&
                        <span style={{ fontSize: 16 }}>PLAYERS TABLE:</span>
                    }
                    <Table
                        dataSource={full ? currentSeasonStats : currentSeasonStats.slice(0, itemsCount)}
                        bordered={false}
                        scroll={{
                            y: tableHeight
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
                    {!full &&
                        <div className={styles.playersTableContentButtons}>
                            <Button type="primary" size="large" className="btn-with-edges-primary" onClick={() => setPlayersModalOpen(true)}>
                                SHOW MORE
                            </Button>
                        </div>
                    }
                </div>
            </CardComponent>
            <PlayersTableModal open={playersModalOpen} onClose={onClosePlayersTableModal} />
        </div>
    )
}

export default PlayersTable;