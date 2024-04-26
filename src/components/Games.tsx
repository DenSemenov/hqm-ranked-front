import styles from './Games.module.css'
import { useSelector } from "react-redux";
import { selectCurrentSeasonGames } from "stores/season";
import { Card, Col, Row } from "antd";
import { convertDate } from "shared/DateConverter";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import PlayerItem from "shared/PlayerItem";
import { useNavigate } from "react-router-dom";

const Games = () => {
    const navigate = useNavigate();

    const currentSeasonGames = useSelector(selectCurrentSeasonGames);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, []);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, [isMobile]);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 42 - 32 - 16 * 2;
        setHeight(h);
    }

    return (
        <Card title={!isMobile ? "Games" : undefined} bodyStyle={{ padding: 0 }} bordered={false} style={{ height: !isMobile ? height : undefined, width: "100%" }}>
            {currentSeasonGames.map(game => (
                <div className={styles.gamesItem} onClick={() => navigate("/game/" + game.gameId)}>
                    <Row gutter={[8, 8]} >
                        <Col span={12}>
                            <span className="subtitle">{convertDate(game.date)}</span>
                        </Col>
                        <Col span={6}>
                            <span className={styles.gameContentTitle + " subtitle"}>SCORE</span>
                        </Col>
                        <Col span={6}>
                            <span className={styles.gameStatusTitle + " subtitle"}>STATUS</span>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={12} className={styles.gameContentName}>
                            <div className={styles.teamTitle}>
                                <PlayerItem id={game.teamRedId} name={game.teamNameRed + " team"} />
                                {"vs"}
                                <PlayerItem id={game.teamBlueId} name={game.teamNameBlue + " team"} />
                            </div>
                        </Col>
                        <Col span={6} className={styles.gameContent} >
                            {game.redScore + " - " + game.blueScore}
                        </Col>
                        <Col span={6} className={styles.gameStatus}>
                            {game.status}
                        </Col>
                    </Row>
                </div>
            ))}
        </Card>
    )
}

export default Games;