import { Col, Row } from "antd";
import PlayersTable from "./PlayersTable";
import Servers from "./Servers";
import Games from "./Games";
import Events from "./Events";
import Ads from "./Ads";
import { useAppDispatch } from "hooks/useAppDispatch";
import { getCurrentUser } from "stores/auth/async-actions";
import { useEffect } from "react";
import { getSeasons, getSeasonsStats } from "stores/season/async-actions";
import { selectCurrentSeason } from "stores/season";
import { useSelector } from "react-redux";

const HomePage = () => {
    const dispatch = useAppDispatch();

    const currentSeason = useSelector(selectCurrentSeason);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(getCurrentUser());
        }

        dispatch(getSeasons());
    }, [])

    useEffect(() => {
        if (currentSeason) {
            dispatch(getSeasonsStats({
                seasonId: currentSeason
            }));
        }
    }, [currentSeason])

    return (
        <Row gutter={[32, 32]}>
            <Col sm={14} xs={24}>
                <PlayersTable />
            </Col>
            <Col sm={5} xs={24}>
                <Events />
            </Col>
            <Col sm={5} xs={24}>
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