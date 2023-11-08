import CardComponent from "shared/CardComponent";
import styles from './Games.module.css'
import { useSelector } from "react-redux";
import { selectCurrentSeasonGames } from "stores/season";
import { Col, Row } from "antd";
import { convertDate } from "shared/DateConverter";
import { useEffect, useState } from "react";

const Games = () => {
    const currentSeasonGames = useSelector(selectCurrentSeasonGames);

    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, []);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 142 - 32 - 100 - 32 * 2;
        setHeight(h);
    }

    return (
        <div className={styles.gamesContainer} style={{ height: height }}>
            <CardComponent edges={[]}>
                <div className={styles.gamesContent}>
                    <span style={{ fontSize: 16 }}>LAST GAMES:</span>
                    <div className={styles.gamesItems}>
                        {currentSeasonGames.map(game => (
                            <>
                                <Row gutter={[8, 8]} >
                                    <Col span={12}>
                                        <span className="subtitle">{convertDate(game.date)}</span>
                                    </Col>
                                    <Col span={6}>
                                        <span className={styles.gameContentTitle + " subtitle"}>SCORE</span>
                                    </Col>
                                    <Col span={6}>
                                        <span className={styles.gameContentTitle + " subtitle"}>STATUS</span>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                                    <Col span={12} className={styles.gameContentName}>
                                        <div>{"TEAM " + game.teamNameRed}</div>
                                        <div>{"VS"}</div>
                                        <div>{"TEAM " + game.teamNameBlue}</div>
                                    </Col>
                                    <Col span={6} className={styles.gameContent} >
                                        {game.redScore + " - " + game.blueScore}
                                    </Col>
                                    <Col span={6} className={styles.gameContent}>
                                        {game.status}
                                    </Col>
                                </Row>
                            </>
                        ))}
                    </div>
                </div>
            </CardComponent>
        </div>
    )
}

export default Games;