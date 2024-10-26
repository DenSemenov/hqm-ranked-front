import { Alert, Avatar, Badge, Button, Col, Divider, Popover, Row, Select, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { sum } from "lodash";
import { IWeeklyTourneyRegistrationParty, IWeeklyTourneyRegistrationPlayer, WeeklyTourneyPartyPlayerState } from "models/IWeelkyTourneyResponse";
import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlayerItem from "shared/PlayerItem";
import { PlayerItemType } from "shared/TeamItem";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import { selectWeeklyTourney } from "stores/weekly-tourney";
import { getWeeklyTourney, weeklyTourneyAcceptDeclineInvite, weeklyTourneyInvite, weeklyTourneyRegister } from "stores/weekly-tourney/async-actions";
import { LuCrown } from "react-icons/lu";
import { FaCrown, FaPlus } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

const { Text, Title } = Typography;

const WeeklyTourneyRegistration = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const weeklyTourney = useSelector(selectWeeklyTourney);
    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);

    const [selectedInvite, setSelectedInvite] = useState<number | undefined>(undefined);

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

    const currentParty = useMemo(() => {
        let current: IWeeklyTourneyRegistrationParty | undefined = undefined;
        weeklyTourney.registration?.parties.forEach(party => {
            if (party.players.filter(x => x.state !== WeeklyTourneyPartyPlayerState.Waiting).findIndex(x => x.id === currentUser?.id) !== -1) {
                current = party as IWeeklyTourneyRegistrationParty;
            }
        })
        return current;
    }, [weeklyTourney, currentUser])

    const isHost = useMemo(() => {
        if (currentParty && currentUser) {
            const party = currentParty as IWeeklyTourneyRegistrationParty;
            const p = party.players.find(x => x.id === currentUser.id);
            return p?.state === WeeklyTourneyPartyPlayerState.Host;
        } else {
            return false;
        }
    }, [currentParty, currentUser])

    const onInviteRemovePlayer = (id: number | undefined) => {
        if (id) {
            dispatch(weeklyTourneyInvite({
                invitedId: id
            }));
        }
    }

    const allPlayersContent = useMemo(() => {
        const registeredPlayers: number[] = []
        weeklyTourney.registration?.parties.forEach(party => {
            registeredPlayers.push(...party.players.filter(x => x.state !== WeeklyTourneyPartyPlayerState.Waiting).map(x => x.id));
        })

        const nonRegistered = weeklyTourney.registration?.allPlayers.filter(x => !registeredPlayers.includes(x.id));

        return <div style={{ display: 'flex', gap: 8, flexDirection: "column" }}>
            {isHost &&
                <>
                    <Select
                        showSearch
                        optionFilterProp="label"
                        style={{ width: "100%" }}
                        placeholder="Select player"
                        onChange={(e) => setSelectedInvite(e)}
                        value={selectedInvite}
                        options={nonRegistered?.map(x => {
                            return {
                                value: x.id,
                                label: x.name
                            }
                        })}
                    />
                    <Button type={"primary"} style={{ width: "100%" }} disabled={selectedInvite === undefined} onClick={() => onInviteRemovePlayer(selectedInvite)}>Invite</Button>
                </>
            }
            {!isHost &&
                <Alert message="You are not party leader" type="error" />
            }

        </div>
    }, [weeklyTourney, selectedInvite, isHost])

    const getPlayerByState = (player: IWeeklyTourneyRegistrationPlayer, isHost: boolean) => {
        return <Badge count={isHost ? <IoCloseCircleSharp color="#e54545" size={20} style={{ cursor: "pointer" }} onClick={() => onInviteRemovePlayer(player.id)} /> : undefined} offset={[-6, 4]}>
            <PlayerItem id={player.id} name={player.name} type={PlayerItemType.Avatar} style={{ opacity: player.state === WeeklyTourneyPartyPlayerState.Waiting ? 0.2 : undefined }} />
        </Badge>
    }

    const currentPartyContent = useMemo(() => {
        if (currentParty) {
            const party = currentParty as IWeeklyTourneyRegistrationParty;
            const host = party.players.find(x => x.state === WeeklyTourneyPartyPlayerState.Host);
            const invited = party.players.filter(x => x.state !== WeeklyTourneyPartyPlayerState.Host);
            const second = invited.length > 0 ? invited[0] : undefined;
            const third = invited.length > 1 ? invited[1] : undefined;
            const four = invited.length > 2 ? invited[2] : undefined;
            return <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {host &&
                    <Badge count={<FaCrown style={{ color: "gold" }} size={20} />} offset={[-6, 4]}>
                        <PlayerItem id={host.id} name={host.name} type={PlayerItemType.Avatar} />
                    </Badge>
                }
                {second && getPlayerByState(second, isHost)}
                {!second &&
                    <Popover content={allPlayersContent} title="Invite player to party" trigger={"click"} onOpenChange={() => setSelectedInvite(undefined)}>
                        <Avatar style={{ cursor: "pointer" }} size={36} ><FaPlus style={{ marginTop: 6 }} /></Avatar>
                    </Popover>
                }
                {third && getPlayerByState(third, isHost)}
                {!third &&
                    <Popover content={allPlayersContent} title="Invite player to party" trigger={"click"} onOpenChange={() => setSelectedInvite(undefined)}>
                        <Avatar style={{ cursor: "pointer" }} size={36} ><FaPlus style={{ marginTop: 6 }} /></Avatar>
                    </Popover>
                }
                {four && getPlayerByState(four, isHost)}
                {!four &&
                    <Popover content={allPlayersContent} title="Invite player to party" trigger={"click"} onOpenChange={() => setSelectedInvite(undefined)}>
                        <Avatar style={{ cursor: "pointer" }} size={36} ><FaPlus style={{ marginTop: 6 }} /></Avatar>
                    </Popover>
                }
            </div>
        }
    }, [currentParty, currentUser, selectedInvite, isHost])

    const onAcceptDecline = (id: string, isAccepted: boolean) => {
        dispatch(weeklyTourneyAcceptDeclineInvite({
            id: id,
            isAccepted: isAccepted
        }));
    }

    const yourInvites = useMemo(() => {
        if (currentUser) {
            const invites = weeklyTourney.registration?.parties.filter(x => x.players.findIndex(x => x.id === currentUser.id && x.state === WeeklyTourneyPartyPlayerState.Waiting) !== -1)
            if (invites?.length !== 0) {
                return <div style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "center" }}>
                    <Title level={5}>Your invites</Title>
                    {invites?.map(invite => {
                        return <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            {invite.players.filter(x => x.state !== WeeklyTourneyPartyPlayerState.Waiting).map(p => {
                                return <PlayerItem id={p.id} name={p.name} type={PlayerItemType.Avatar} />
                            })}
                            <Button type="primary" onClick={() => onAcceptDecline(invite.partyId, true)}>Accept</Button>
                            <Button danger onClick={() => onAcceptDecline(invite.partyId, false)}>Decline</Button>
                        </div>
                    })}
                </div>
            }
        }
    }, [weeklyTourney, currentParty, currentUser])

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
                <Title level={4}>{sum(weeklyTourney.registration?.parties.map(x => x.players.filter(y => y.state === WeeklyTourneyPartyPlayerState.Accepted || y.state === WeeklyTourneyPartyPlayerState.Host).length)) + " / 16"}</Title>
                {currentPartyContent}
                <Button type="primary" danger={currentParty != null} onClick={onRegister}>{currentParty != null ? "Cancel registration" : "Register"}</Button>
                {yourInvites}
            </Col>
        </Row>
    )
}

export default WeeklyTourneyRegistration;
