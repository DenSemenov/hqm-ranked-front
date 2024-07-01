import { Button, Card, Col, Input, Row, Table } from "antd";
import Meta from "antd/es/card/Meta";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { convertMoney } from "shared/MoneyCoverter";
import { selectStorageUrl } from "stores/season";
import { selectFreeAgents, selectTeamsState } from "stores/teams";
import { cancelInvite, getFreeAgents, getTeamsState, invitePlayer } from "stores/teams/async-actions";

const { Search } = Input;

const FreeAgents = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const freeAgents = useSelector(selectFreeAgents);
    const storageUrl = useSelector(selectStorageUrl);
    const teamsState = useSelector(selectTeamsState);

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (searchParams.has("s")) {
            const s = searchParams.get("s");
            if (s) {
                setSearch(s)
            }
        }

        dispatch(getFreeAgents())
        dispatch(getTeamsState())
    }, [])

    useEffect(() => {
        setSearchParams(
            createSearchParams({ s: search })
        )
    }, [search])

    const filtered = useMemo(() => {
        return freeAgents.filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, freeAgents])

    const onInvitePlayer = (playerId: number) => {
        dispatch(invitePlayer({
            invitedId: playerId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
            dispatch(getFreeAgents())
        })
    }

    const onCancelInvitePlayer = (inviteId: string) => {
        dispatch(cancelInvite({
            inviteId: inviteId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
            dispatch(getFreeAgents())
        })
    }

    return (
        <Row gutter={[32, 32]} style={{ marginTop: isMobile ? 16 : 0 }}>
            <Col span={24}>
                <Search
                    size={"large"}
                    placeholder="Search"
                    allowClear
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={(value) => setSearch(value)}
                />
            </Col>
            {filtered.map(fa => {
                return <Col sm={4} xs={12}>
                    <Card
                        onClick={() => navigate("/player?id=" + fa.id)}
                        hoverable
                        cover={<img style={{ borderRadius: 8 }} alt={fa.name} src={storageUrl + "images/" + fa.id + ".png"} />}
                    >
                        <Meta
                            style={{
                                padding: 16,
                                width: "calc(2px + 100%)",
                                borderRadius: "0 0 8px 8px",
                                position: "absolute",
                                bottom: 2,
                                left: -1,
                                background: "linear-gradient(180deg, transparent 0%, rgba(8, 8, 8, 0.685) 100%)"
                            }}
                            title={fa.name}
                            description={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span>{convertMoney(fa.cost)}</span>
                                {(teamsState.isCaptain || teamsState.isAssistant) && teamsState.team && !fa.inviteId &&
                                    <Button
                                        type="primary"
                                        disabled={teamsState.team.budget < fa.cost}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onInvitePlayer(fa.id)
                                        }}
                                    >
                                        Invite
                                    </Button>
                                }
                                {(teamsState.isCaptain || teamsState.isAssistant) && teamsState.team && fa.inviteId &&
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCancelInvitePlayer(fa.inviteId as string)
                                        }}
                                    >
                                        Cancel invite
                                    </Button>
                                }
                            </div>}
                        />
                    </Card>
                </Col>
            })}
        </Row>
    )
}

export default FreeAgents;