import { Col, Row } from "antd";
import PlayersTable from "./PlayersTable";
import Servers from "./Servers";
import Games from "./Games";
import Events from "./Events";
import Ads from "./Ads";
import { useAppDispatch } from "hooks/useAppDispatch";
import { getCurrentUser } from "stores/auth/async-actions";
import { useEffect } from "react";
import { getSeasons, getSeasonsGames, getSeasonsStats } from "stores/season/async-actions";
import { selectCurrentSeason } from "stores/season";
import { useSelector } from "react-redux";
import { getActiveServers } from "stores/server/async-actions";

const HomePage = () => {
    const dispatch = useAppDispatch();

    const currentSeason = useSelector(selectCurrentSeason);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(getCurrentUser());
        }

        dispatch(getSeasons());
        dispatch(getActiveServers());
    }, [])

    useEffect(() => {
        if (currentSeason) {
            dispatch(getSeasonsStats({
                seasonId: currentSeason
            }));
            dispatch(getSeasonsGames({
                seasonId: currentSeason
            }));

        }
    }, [currentSeason])

    return (
        <Row gutter={[32, 32]}>
            <Col sm={14} xs={24}>
                <PlayersTable full={false} />
            </Col>
            {/* <Col sm={5} xs={24}>
                <Events />
            </Col> */}
            <Col sm={10} xs={24}>
                <Games />
            </Col>
            <Col sm={14}>
                <Servers />
            </Col>
            <Col sm={10}>
                <Ads />
            </Col>
        </Row>
    )
}

export default HomePage;