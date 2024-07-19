
import { Avatar, Badge, Button, Card, Col, List, notification, Popover, Row, Select, Space, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css'
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuth } from 'stores/auth';
import { getCurrentUser } from 'stores/auth/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import ChangePasswordModal from './ChangePasswordModal';
import { selectClearImageCache, selectCurrentMode, selectCurrentSeason, selectPatrols, selectSeasons, selectStorageUrl, setCurrentMode, setCurrentSeason, setSeasons } from 'stores/season';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeButton from './ThemeButton';
import { isMobile } from 'react-device-detect';
import { getPatrol } from 'stores/season/async-actions';
import { convertDate, getWeekEnd } from 'shared/DateConverter';
import { CaretRightOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { IInstanceType } from 'models/IInstanceType';
import { selectPlayerInvites, selectTeamsState } from 'stores/teams';
import { applyPlayerInvite, cancelInvite, declinePlayerInvite, getInvites, getTeamsState } from 'stores/teams/async-actions';
import TeamItem from 'shared/TeamItem';
import { selectCoins, selectContracts } from 'stores/contract';
import { FaCoins } from "react-icons/fa";
import { ContractType, IContractResponse } from 'models/IContractResponse';
import { getContracts, selectContract } from 'stores/contract/async-actions';
import { FaCheck } from "react-icons/fa";

const { Text, Title } = Typography;

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);
    const storageUrl = useSelector(selectStorageUrl);
    const currentSeason = useSelector(selectCurrentSeason);
    const seasons = useSelector(selectSeasons);
    const patrols = useSelector(selectPatrols);
    const currentMode = useSelector(selectCurrentMode);
    const playerInvites = useSelector(selectPlayerInvites);
    const teamsState = useSelector(selectTeamsState);
    const clearImageCache = useSelector(selectClearImageCache);
    const contracts = useSelector(selectContracts);
    const coins = useSelector(selectCoins);

    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth) {
            dispatch(getCurrentUser());
            dispatch(getPatrol())
            dispatch(getInvites())
        }
    }, [isAuth])

    useEffect(() => {
        if (currentUser) {
            if (!currentUser.isAcceptedRules && location.pathname !== "/rules") {
                navigate("/rules")
            }
            if (currentUser.isAcceptedRules) {
                if (location.pathname === "/rules") {
                    navigate("/")
                }
            }
        }
    }, [currentUser, currentUser?.isAcceptedRules, location])

    const onCloseChangePasswordModal = () => {
        setChangePasswordModalOpen(false);
    }

    const userName = useMemo(() => {
        if (currentUser) {
            return currentUser.name;
        } else {
            return null;
        }
    }, [currentUser]);

    const loginPage = () => {
        navigate("/login")
    }

    const avatarName = useMemo(() => {
        return (currentUser && currentUser.name) ? currentUser.name[0].toUpperCase() : "";
    }, [currentUser])

    const query = useMemo(() => {
        if (clearImageCache) {
            return clearImageCache.getTime();
        }
    }, [clearImageCache])

    const loginButton = useMemo(() => {
        if (!isMobile) {
            if (userName && currentUser && isAuth) {
                return <Badge count={currentUser.isBanned ? "BAN" : undefined} offset={[-16, 16]}>
                    <Avatar shape='square' style={{ cursor: "pointer" }} src={storageUrl + "images/" + currentUser.id + ".png" + "?t=" + query} onClick={() => navigate("/profile")}>{avatarName}</Avatar>
                </Badge>
            } else {
                return <Button icon={<UserOutlined />} onClick={loginPage} />
            }
        } else {
            return <></>
        }
    }, [isMobile, currentUser, userName, avatarName, isAuth, query])

    const onApplyInvite = (inviteId: string) => {
        dispatch(applyPlayerInvite({
            inviteId: inviteId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
            dispatch(getInvites())
        })
    }

    const onDeclineInvite = (inviteId: string) => {
        dispatch(declinePlayerInvite({
            inviteId: inviteId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
            dispatch(getInvites())
        })
    }

    const playerInvitesContent = useMemo(() => {
        return <List
            dataSource={playerInvites}
            renderItem={(item, index) => {
                return <Row className={styles.patrolHeader}>
                    <Col span={12}>
                        <TeamItem id={item.teamId} name={item.teamName} />
                    </Col>
                    <Col span={12} className='right-align' >
                        <Space size={"small"}>
                            <Button type="primary" icon={<CheckOutlined />} onClick={() => onApplyInvite(item.inviteId)} />
                            <Button type="primary" danger icon={<CloseOutlined />} onClick={() => onDeclineInvite(item.inviteId)} />
                        </Space>
                    </Col>

                </Row>
            }}
        />
    }, [playerInvites])

    const playerInvitesNotify = useMemo(() => {
        if (playerInvites.length !== 0 && !teamsState.team) {
            return <Popover content={playerInvitesContent} title="Invites to team" trigger={"click"}>
                <Badge count={playerInvites.length}>
                    <Button
                        type="text"
                        title='Invites'
                        icon={<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="24px" height="24px" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#ff2147" stroke="none">
                                <path d="M446 4634 c-153 -37 -308 -162 -378 -304 -71 -145 -68 -86 -68 -1490 0 -1404 -3 -1345 68 -1490 53 -108 151 -205 263 -258 46 -22 108 -45 137 -51 35 -7 279 -11 724 -11 l672 0 255 -253 c286 -283 308 -299 426 -305 54 -3 83 1 130 19 55 20 81 43 321 280 l260 259 672 0 c445 0 689 4 724 11 162 33 328 161 401 310 70 142 67 74 67 1489 0 1078 -3 1286 -15 1344 -46 216 -225 401 -436 451 -93 22 -4132 21 -4223 -1z m1896 -942 c253 -124 311 -459 113 -657 -238 -237 -634 -111 -694 222 -35 192 91 397 282 459 27 9 77 13 138 11 84 -2 103 -6 161 -35z m987 -142 c46 -13 99 -65 111 -110 5 -19 10 -60 10 -91 l0 -57 79 -3 c88 -4 118 -19 159 -79 30 -45 30 -115 -1 -160 -34 -51 -78 -72 -163 -78 l-74 -5 0 -61 c0 -72 -28 -138 -73 -170 -40 -29 -134 -29 -173 0 -55 41 -69 70 -72 153 l-4 79 -78 4 c-66 4 -84 9 -114 32 -97 73 -90 206 12 264 31 17 56 22 111 22 l71 0 0 67 c0 105 40 169 119 193 36 11 42 11 80 0z m-601 -839 c75 -41 125 -94 161 -170 25 -54 26 -64 29 -259 3 -195 2 -204 -20 -243 -13 -23 -40 -51 -64 -65 l-41 -24 -628 0 -628 0 -44 25 c-27 16 -51 41 -64 66 -19 38 -20 55 -17 247 3 204 3 208 30 259 37 69 81 118 135 150 92 53 82 53 603 50 l485 -2 63 -34z" />
                            </g>
                        </svg>}
                    />
                </Badge>
            </Popover>
        }
    }, [playerInvites, teamsState])

    const patrolContent = useMemo(() => {
        return <List
            dataSource={patrols}
            renderItem={(item, index) => {
                return <Row className={styles.patrolHeader}>
                    <Col span={2}>
                        <Button size="small" icon={<CaretRightOutlined />} type="primary" onClick={(e) => {
                            e.stopPropagation();
                            navigate("/patrol?id=" + item.reportId)
                        }} />
                    </Col>
                    <Col span={12}>

                        <Text>{item.reason}</Text>
                    </Col>
                    <Col span={10} className='right-align'>
                        <Text type={"secondary"}>{convertDate(item.date)}</Text>
                    </Col>
                </Row>
            }}
        />
    }, [patrols])

    const patrolsButton = useMemo(() => {
        if (patrols.length !== 0) {
            return <Popover content={patrolContent} title="Patrol" trigger={"click"}>
                <Button
                    type="text"
                    title='Patrol'
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1"><path d="M892.9 145.2H130.1c-33.5 0-60.7 27.2-60.7 60.7v503.4c0 33.4 27.2 60.7 60.7 60.7h762.8c33.5 0 60.7-27.2 60.7-60.7V205.8c0-33.4-27.3-60.6-60.7-60.6z m8.7 564.1c0 4.8-3.9 8.7-8.7 8.7H130.1c-4.8 0-8.7-3.9-8.7-8.7V205.8c0-4.8 3.9-8.7 8.7-8.7h762.8c4.8 0 8.7 3.9 8.7 8.7v503.5zM719.3 823.9h-416c-14.4 0-26 11.6-26 26s11.6 26 26 26h416.1c14.4 0 26-11.6 26-26s-11.7-26-26.1-26z m-83.2-384.8l-173.4-104c-8-4.8-18-4.9-26.2-0.3-8.1 4.6-13.2 13.3-13.2 22.6v208c0 9.4 5 18 13.2 22.6 4 2.3 8.4 3.4 12.8 3.4 4.6 0 9.3-1.3 13.4-3.7l173.4-104c7.8-4.7 12.6-13.2 12.6-22.3 0-9.1-4.8-17.6-12.6-22.3z" fill="#5F9BEB" /></svg>}
                />
            </Popover>
        }
    }, [patrols, patrolContent])

    const endsIn = useMemo(() => {
        if (currentSeason) {
            const current = seasons.find(x => x.id === currentSeason)
            if (current) {
                const leftDays = Math.round((new Date(current.dateEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return <Popover trigger={["click", "hover"]} content={<Card>
                    <Select
                        options={seasons.map(x => {
                            return {
                                value: x.id,
                                label: <><Text>{x.name}</Text><Text style={{ marginLeft: 8 }} type="secondary">{new Date(x.dateStart).toLocaleDateString() + " - " + new Date(x.dateEnd).toLocaleDateString()}</Text></>
                            }
                        })}
                        value={currentSeason}
                        onChange={(value) => {
                            dispatch(setCurrentSeason(value))
                        }}
                    />
                </Card>}>
                    <Tag style={{ height: 20, marginLeft: 16 }}>{leftDays + " days left"}</Tag>
                </Popover>
            }
        }
    }, [currentSeason, seasons])


    const onSelectContract = (item: IContractResponse) => {
        if (contracts.filter(x => x.isSelected).length < 2) {
            if (!item.isSelected) {
                if (!isAuth) {
                    navigate("/login")
                } else {
                    dispatch(selectContract({
                        id: item.id
                    })).unwrap().then(() => {
                        dispatch(getContracts())
                    })
                }
            }
        } else {
            notification.info({
                message: "You can select only two contracts"
            })
        }
    }

    const getContractItem = (item: IContractResponse) => {
        let text = "";
        let color = "";
        switch (item.contractType) {
            case ContractType.Assists:
                text = `Do ${item.count} assists`;
                color = "linear-gradient(to top, #b92b27, #1565c0)";
                break;
            case ContractType.WinWith800Elo:
                text = `Win ${item.count} games with a player less than 800 elo`;
                color = "linear-gradient(to top, #aa4b6b, #6b6b83, #3b8d99)";
                break;
            case ContractType.Saves:
                text = `Do ${item.count} saves`;
                color = "linear-gradient(to top, #c31432, #240b36)";
                break;
            case ContractType.WinWith20Possesion:
                text = `Win ${item.count} games with possession lower than 20%`;
                color = "linear-gradient(to top, #333333, #dd1818)";
                break;
            case ContractType.Winstreak:
                text = `Win ${item.count} games in a row`;
                color = "linear-gradient(to top, #000046, #1cb5e0)";
                break;
            case ContractType.RiseInRanking:
                text = `Climb ${item.count} positions`;
                color = "linear-gradient(to top, #43c6ac, #191654)";
                break;
        }
        const date = new Date(item.selectedDate);
        date.setDate(date.getDate() + 7);
        const leftDays = Math.round((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return <div className={styles.contactCard} style={{ background: color, filter: item.isHidden ? "grayscale()" : undefined, outline: item.isSelected ? "4px solid #1c40af" : undefined }} onClick={() => onSelectContract(item)}>
            <div className={styles.contactCardPoints} style={{ bottom: item.isSelected ? 32 : 8 }}><FaCoins color={"gold"} />{item.points}</div>
            {item.isSelected &&
                <Tag className={styles.contactCardDate}>{leftDays + " days left"}</Tag>
            }
            <div className={styles.contactCardText} >{text}</div>
        </div>
    }

    const contractsContent = useMemo(() => {
        return <Popover
            trigger={"click"}
            content={
                <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
                    <Row>
                        <Col span={18} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Title level={5}>Select 2 contracts</Title>
                        </Col>
                        <Col span={6} className='right-align' style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "end" }}>
                            <FaCoins color={"gold"} />{coins}
                        </Col>
                    </Row>

                    <div className={styles.contractContainer}>
                        {contracts.map(c => {
                            return getContractItem(c);
                        })}
                    </div>
                </div>
            }
        >
            <Button style={{ background: 'linear-gradient(135deg, #6253E1, #04BEFE)' }} size="small">
                <Text>CONTRACTS</Text>
            </Button>
        </Popover>
    }, [contracts, isAuth, coins])

    const onChangeMode = (mode: IInstanceType) => {
        dispatch(setCurrentMode(mode))
        navigate("/")
    }

    return (
        <>
            <div style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                <svg height="36" width="36" onClick={() => onChangeMode(IInstanceType.Ranked)} className={currentMode !== IInstanceType.Ranked ? styles.filteredLogo : undefined}>
                    <image href="/icons/logo.svg" height="36" width="36" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13.2939 7.17041L11.9998 12L10.7058 16.8297" stroke="#4d4d4d" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div className={styles.teamsLogo + " " + (currentMode !== IInstanceType.Teams ? styles.filteredLogo : undefined)} onClick={() => onChangeMode(IInstanceType.Teams)}>
                    TEAMS
                </div>
                {endsIn}
            </div>
            <div className={styles.headerContainerLogin}>
                {contractsContent}
                <ThemeButton />
                {playerInvitesNotify}
                {patrolsButton}
                {loginButton}
            </div>
            <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
        </ >
    )
}

export default Header;