import styles from './Games.module.css'
import { useSelector } from "react-redux";
import { selectCurrentSeasonGames } from "stores/season";
import { Avatar, Card, Col, Row, Tag } from "antd";
import { convertDate } from "shared/DateConverter";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
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
                <div className={styles.gamesItem} onClick={() => navigate("/game?id=" + game.gameId)}>
                    <Row gutter={[8, 8]} >
                        <Col span={16}>
                            <span className="subtitle">{convertDate(game.date)}</span>
                        </Col>
                        <Col span={8} className="right-align">
                            <Tag style={{ marginRight: 0 }}>{game.status}</Tag>
                        </Col>
                        <Col span={16} className={styles.gameContentName}>
                            <div className={styles.teamTitle}>
                                <Avatar.Group>
                                    {game.players.filter(x => x.team == 0).map(x => {
                                        return <PlayerItem id={x.id} name={x.name} type={PlayerItemType.Avatar} />
                                    })}
                                </Avatar.Group>
                                {"vs"}
                                <Avatar.Group>
                                    {game.players.filter(x => x.team == 1).map(x => {
                                        return <PlayerItem id={x.id} name={x.name} type={PlayerItemType.Avatar} />
                                    })}
                                </Avatar.Group>
                            </div>
                        </Col>
                        <Col span={8} className={styles.gameContent} >
                            {game.redScore + " - " + game.blueScore}
                        </Col>
                    </Row>
                </div>
            ))}
        </Card>
    )
}

export default Games;