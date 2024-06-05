
import { Avatar, Badge, Button, Card, Col, List, Popover, Row, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css'
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuth } from 'stores/auth';
import { getCurrentUser } from 'stores/auth/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import ChangePasswordModal from './ChangePasswordModal';
import { selectCurrentSeason, selectPatrols, selectSeasons, selectStorageUrl } from 'stores/season';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeButton from './ThemeButton';
import { isMobile } from 'react-device-detect';
import { getPatrol } from 'stores/season/async-actions';
import { convertDate } from 'shared/DateConverter';
import { CaretRightOutlined } from "@ant-design/icons";

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

    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth) {
            dispatch(getCurrentUser());
            dispatch(getPatrol())
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

    const loginButton = useMemo(() => {
        if (!isMobile) {
            if (userName && currentUser && isAuth) {
                return <Badge count={currentUser.isBanned ? "BAN" : undefined} offset={[-16, 16]}>
                    <Avatar shape='square' style={{ cursor: "pointer" }} src={storageUrl + "images/" + currentUser.id + ".png"} onClick={() => navigate("/profile")}>{avatarName}</Avatar>
                </Badge>
            } else {
                return <Button icon={<UserOutlined />} onClick={loginPage} />
            }
        } else {
            return <></>
        }
    }, [isMobile, currentUser, userName, avatarName, isAuth])

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
                return <Tag color="#108ee9" style={{ height: 20 }}>{leftDays + " days left"}</Tag>
            }
        }
    }, [currentSeason, seasons])


    return (
        <>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <svg height="36" width="36" onClick={() => navigate("/")}>
                    <image href="/icons/logo.svg" height="36" width="36" />
                </svg>
                {endsIn}
            </div>
            <div className={styles.headerContainerLogin}>
                <ThemeButton />
                {patrolsButton}
                {loginButton}
            </div>
            <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
        </ >
    )
}

export default Header;