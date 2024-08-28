import { Badge, Button, Card, Col, Form, InputNumber, List, Modal, Popover, Row, Select, Tag } from "antd";
import Meta from "antd/es/card/Meta";
import { useAppDispatch } from "hooks/useAppDispatch";
import { Position } from "models/ITransferMarketRequest";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertMoney } from "shared/MoneyCoverter";
import { selectStorageUrl } from "stores/season";
import { selectTeamsState, selectTransferMarkets } from "stores/teams";
import { askToJoinTeam, createTransferMarket, getTransferMarket, removeTransferMarket } from "stores/teams/async-actions";
import { DeleteOutlined } from "@ant-design/icons";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import { ITransferMarketResponse } from "models/ITransferMarketResponse";
import PlayerItem from "shared/PlayerItem";
import { convertDate } from "shared/DateConverter";

const TransferMarket = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const transferMarkets = useSelector(selectTransferMarkets);
    const storageUrl = useSelector(selectStorageUrl);
    const teamsState = useSelector(selectTeamsState);
    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);

    const [positionsSelectorOpen, setPositionSelectorOpen] = useState<boolean>(false);
    const [selectedTransferMarket, setSelectedTransferMarket] = useState<ITransferMarketResponse | undefined>(undefined);

    useEffect(() => {
        dispatch(getTransferMarket())
    }, [])

    const onAddTransferMarket = (values: any) => {
        if (teamsState.team) {
            dispatch(createTransferMarket({
                positions: values.positions,
                budget: values.budget ?? teamsState.team.budget
            })).unwrap().then(() => {
                dispatch(getTransferMarket())
            })
        }
    }

    const onRemoveTransferMarket = (id: string) => {
        dispatch(removeTransferMarket({
            id: id
        })).unwrap().then(() => {
            dispatch(getTransferMarket())
        })
    }

    const getPositionName = (position: Position) => {
        switch (position) {
            case Position.Gk:
                return "Goalkeeper"
            case Position.Def:
                return "Defender";
            case Position.Fwd:
                return "Forward"
        }
    }

    const onAskToJoinTeam = (positions: Position[]) => {
        if (selectedTransferMarket) {
            dispatch(askToJoinTeam({
                id: selectedTransferMarket.id,
                positions: positions
            })).unwrap().then(() => {
                dispatch(getTransferMarket())
                setPositionSelectorOpen(false);
            })
        }
    }

    const onAskToJoinTeamModal = (id: string) => {
        setPositionSelectorOpen(true);
    }

    return (
        <Row gutter={[32, 32]} style={{ marginTop: isMobile ? 16 : 0 }}>
            {(teamsState.isCaptain || teamsState.isAssistant) && teamsState.team &&
                <Col span={24}>
                    <Popover
                        title="Create transfer market suggestion"
                        placement="bottom"
                        trigger={"click"}
                        content={<Form
                            style={{ width: 300 }}
                            layout="vertical"
                            onFinish={onAddTransferMarket}
                        >
                            <Form.Item
                                label="Positions"
                                name="positions"
                                rules={[{ required: true, message: 'Please select position' }]}
                            >
                                <Select
                                    mode="multiple"
                                    options={[
                                        {
                                            value: Position.Gk,
                                            label: "Goalkeeper",
                                        },
                                        {
                                            value: Position.Def,
                                            label: "Defender",
                                        },
                                        {
                                            value: Position.Fwd,
                                            label: "Forward",
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Budget"
                                name="budget"
                            >
                                <InputNumber min={100000} max={teamsState.team.budget} defaultValue={teamsState.team.budget} />
                            </Form.Item>
                            <Form.Item >
                                <Button type="primary" htmlType="submit">
                                    Create transfer market suggestion
                                </Button>
                            </Form.Item>
                        </Form>}
                    >
                        <Button type={"primary"} style={{ width: "100%" }} >Create transfer market suggestion</Button>
                    </Popover>
                </Col>
            }
            {transferMarkets.map(fa => {
                return <Col sm={6} xs={12}>
                    <Card

                        hoverable
                        cover={<img
                            onClick={() => navigate("/team?id=" + fa.teamId)} style={{ borderRadius: 8, objectFit: "cover" }} alt={fa.teamName} height={150} src={storageUrl + "images/" + fa.teamId + ".png"} />}
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
                            title={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span>{fa.teamName}</span>
                                <span>{"<" + convertMoney(fa.budget)}</span>
                            </div>}
                            description={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {fa.positions.map(tag => {
                                        return <Tag>{getPositionName(tag)}</Tag>
                                    })}
                                </div>
                                <Popover
                                    title="Requests"
                                    placement="bottom"
                                    trigger={"click"}
                                    content={<List
                                        itemLayout="horizontal"
                                        bordered
                                        style={{ maxHeight: 400, overflow: "auto", width: 400 }}
                                        dataSource={fa.askedToJoin}
                                        renderItem={(item, index) => (
                                            <List.Item onClick={() => navigate("/free-agents?s=" + item.name)} style={{ cursor: "pointer" }} >
                                                <PlayerItem id={item.id} name={item.name} />
                                                <span style={{ display: "flex", gap: 8 }}>
                                                    {item.positions.map(p => {
                                                        return <Tag>{getPositionName(p)}</Tag>
                                                    })}
                                                </span>
                                                <Tag >{convertMoney(item.cost)}</Tag>
                                            </List.Item>
                                        )}
                                    />}
                                >
                                    <Badge count={fa.askedToJoin.length} offset={[-70, 0]}>
                                        <Button type="primary" size="small" >
                                            Requests
                                        </Button>
                                    </Badge>
                                </Popover>

                                {isAuth && !teamsState.team && teamsState.cost !== 0 &&
                                    <Button type="primary" size="small" disabled={fa.askedToJoin.findIndex(x => x.id === currentUser?.id) !== -1} onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTransferMarket(fa);
                                        onAskToJoinTeamModal(fa.id)
                                    }}>
                                        Ask to join the team
                                    </Button>
                                }
                            </div>}
                        />
                        {teamsState.team && teamsState.team.id === fa.teamId && (teamsState.isCaptain || teamsState.isAssistant) &&
                            <div style={{ position: "absolute", top: 8, right: 16 }}>
                                <Button
                                    title={"Remove transfer market suggestion"}
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveTransferMarket(fa.id)
                                    }}
                                />
                            </div>
                        }
                        <div style={{ position: "absolute", top: 8, left: 16 }}>
                            {convertDate(fa.date)}
                        </div>
                    </Card>
                </Col>
            })}
            <Modal
                title="Select positions"
                open={positionsSelectorOpen}
                onCancel={() => setPositionSelectorOpen(false)}
                footer={[]}
            >
                <Form
                    style={{ width: 300 }}
                    layout="vertical"
                    onFinish={(values) => onAskToJoinTeam(values.positions)}
                >
                    <Form.Item
                        label="Positions"
                        name="positions"
                        rules={[{ required: true, message: 'Please select position' }]}
                    >
                        <Select
                            mode="multiple"
                            options={
                                selectedTransferMarket?.positions.map(pos => {
                                    return {
                                        label: getPositionName(pos),
                                        value: pos
                                    }
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Ask to join the team
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    )
}

export default TransferMarket;