import { Table } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import PlayerItem from "shared/PlayerItem";
import { selectTopStats } from "stores/season";
import { getTopStats } from "stores/season/async-actions";

const Top = () => {
    const dispatch = useAppDispatch();

    const topStats = useSelector(selectTopStats);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        dispatch(getTopStats())

        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        const playerCard = document.getElementById("layout");
        if (playerCard) {
            let h = playerCard.clientHeight - 37;
            setHeight(h);
        }

    }


    console.log(topStats)

    return <Table
        dataSource={topStats}
        bordered={false}
        scroll={{
            y: !isMobile ? height : undefined
        }}
        rowKey={"id"}
        loading={topStats.length === 0}
        pagination={false}
        columns={[
            {
                title: "NICKNAME",
                width: 160,
                dataIndex: "nickname",
                ellipsis: true,
                fixed: "left",
                render(value, record, index) {
                    return <PlayerItem id={record.id} name={record.name} />
                },
            },
            {
                title: "GP",
                width: 90,
                align: "right",
                dataIndex: "gp",
                sorter: (a, b) => a.gp - b.gp,
            },
            {
                title: "WIN",
                width: 90,
                align: "right",
                sorter: (a, b) => a.wins - b.wins,
                dataIndex: "wins"
            },
            {
                title: "LOSE",
                width: 90,
                align: "right",
                sorter: (a, b) => a.loses - b.loses,
                dataIndex: "loses"
            },
            {
                title: "WINRATE",
                width: 90,
                align: "right",
                dataIndex: "winrate",
                sorter: (a, b) => a.winrate - b.winrate,
                render(value, record, index) {
                    return value + "%"
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
                dataIndex: "goalsPerGame",
                sorter: (a, b) => a.goalsPerGame - b.goalsPerGame,
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
                dataIndex: "assistsPerGame",
                sorter: (a, b) => a.assistsPerGame - b.assistsPerGame,
            },
            {
                title: "RATING",
                width: 120,
                align: "right",
                dataIndex: "elo",
                sorter: (a, b) => a.elo - b.elo,
                fixed: "right",
            },
        ]}
    />
}

export default Top;