import { Alert, Avatar, Button, Col, Divider, Row, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlayerItem from "shared/PlayerItem";
import { PlayerItemType } from "shared/TeamItem";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import { selectWeeklyTourney } from "stores/weekly-tourney";
import { getWeeklyTourney, weeklyTourneyRegister } from "stores/weekly-tourney/async-actions";

const { Text, Title } = Typography;

const WeeklyTourneyRegistration = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const weeklyTourney = useSelector(selectWeeklyTourney);
    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);

    const onRegister = () => {
        if (isAuth) {
            dispatch(weeklyTourneyRegister()).unwrap().then(() => {
                const id = searchParams.get("id");
                if (id) {
                    dispatch(getWeeklyTourney({
                        id: id
                    }));
                }
            });
        } else {
            navigate("/login")
        }
    }

    const isRegistered = useMemo(() => {
        return weeklyTourney.registration?.players.findIndex(x => x.id === currentUser?.id) !== -1;
    }, [weeklyTourney, currentUser])

    return (
        <Row style={{ padding: isMobile ? 16 : 0, height: "100%" }}>
            <Col sm={7} xs={0} />
            <Col sm={10} xs={24} style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center", alignItems: "center" }}>

                <Text type="secondary">Registration for</Text>
                <Title level={3}>{weeklyTourney.registration?.tourneyName}</Title>
                <Divider />
                <Text type="secondary">The weekly tournament is a competition between random teams. Registration lasts 30 minutes, after which the game schedule will be displayed. The tournament takes place every Saturday from 20:30 am.m. to 23:00 a.m. (Moscow time)</Text>
                <Alert message="By clicking the registration button, you confirm your availability for the duration of the tournament" type="warning" />
                <Divider />
                <Avatar.Group
                    max={{
                        count: 5,
                        style: { height: 36, width: 36 },
                    }}
                >
                    {weeklyTourney.registration?.players.map(player => {
                        return <PlayerItem id={player.id} name={player.name} type={PlayerItemType.Avatar} isOnlyAvatar />
                    })}
                </Avatar.Group>
                <Button type="primary" danger={isRegistered} onClick={onRegister}>{isRegistered ? "Cancel registration" : "Register"}</Button>
            </Col>
        </Row>
    )
}

export default WeeklyTourneyRegistration;
