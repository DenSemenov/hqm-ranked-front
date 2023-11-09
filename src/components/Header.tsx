
import { Button, Col, Flex, Popover, Row, Select } from 'antd';
import CardComponent, { EdgeType } from '../shared/CardComponent';
import { UserOutlined, HomeOutlined, BorderlessTableOutlined, CloudServerOutlined } from '@ant-design/icons';
import styles from './Header.module.css'
import LoginModal from './LoginModal';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuth, setCurrentUser, setIsAuth } from 'stores/auth';
import { getCurrentUser } from 'stores/auth/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import ChangePasswordModal from './ChangePasswordModal';
import { selectCurrentSeason, selectSeasons, setCurrentSeason } from 'stores/season';
import { BrowserView, MobileView } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import ThemeButton from './ThemeButton';

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);
    const seasons = useSelector(selectSeasons);
    const currentSeason = useSelector(selectCurrentSeason);


    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth) {
            setLoginModalOpen(false);
            dispatch(getCurrentUser());
        }
    }, [isAuth])

    const onCloseLoginModal = () => {
        setLoginModalOpen(false);
    }

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

    const onLogout = () => {
        dispatch(setCurrentUser(null));
        dispatch(setIsAuth({
            success: false,
            token: ''
        }));
    }

    const getPlayerMenu = () => {
        return <div className={styles.headerContainerPlayerMenu}>
            <Button onClick={() => setChangePasswordModalOpen(true)}>Change password</Button>
            <Button danger onClick={onLogout}>Log out</Button>
        </div>
    }

    const getLoginButton = () => {
        if (userName) {
            return <Popover content={getPlayerMenu()} trigger="click" placement='bottomLeft'>
                <Button type="link" icon={<UserOutlined />} >
                    {userName}
                </Button>
            </Popover>
        } else {
            return <Button type="link" icon={<UserOutlined />} onClick={() => setLoginModalOpen(true)}>
                LOGIN
            </Button>
        }
    }

    const getLoginMobileButton = () => {
        if (userName) {
            return <Button type="link" icon={<UserOutlined />} />
        } else {
            return <Button type="link" icon={<UserOutlined />} onClick={() => setLoginModalOpen(true)} />
        }
    }

    const seasonItems = useMemo(() => {
        return seasons.map(x => {
            return {
                value: x.id,
                label: x.name,
            }
        })
    }, [seasons]);

    return (
        <>
            <BrowserView>
                <div className={styles.headerContainer}>
                    <CardComponent edges={[EdgeType.LeftBottom, EdgeType.RightTop]}>
                        <Row style={{ height: "100%", padding: "0 16px" }}>
                            <Col sm={6} xs={12} className={styles.headerContainerLogo}>
                                <span>
                                    <svg height="88" width="88">
                                        <image href="/icons/logo.svg" height="88" width="88" />
                                    </svg>
                                </span>
                                <div>
                                    HQM
                                    <br />
                                    RANKED
                                </div>
                            </Col>
                            <Col sm={0} xs={12} >
                                <div className={styles.headerContainerLogin}>
                                    {getLoginButton()}
                                </div>
                            </Col>
                            <Col sm={12} className={styles.headerContainerItems}>
                                <Select
                                    onChange={(value: string) => dispatch(setCurrentSeason(value))}
                                    value={currentSeason}
                                    options={seasonItems}
                                />
                                <Button type="link">
                                    NEWS
                                </Button>
                                <Button type="link">
                                    TEAMS
                                </Button>
                                <Button type="link">
                                    TOURNAMENTS
                                </Button>
                            </Col>
                            <Col sm={6} xs={0}>
                                <div className={styles.headerContainerLogin}>
                                    <div className={styles.headerContainerLinks}>
                                        <Button
                                            type="link"
                                            icon={<svg height="24" width="24">
                                                <image href="/icons/youtube.svg" height="24" width="24" />
                                            </svg>}
                                        />
                                        <Button
                                            type="link"
                                            icon={<svg height="24" width="24">
                                                <image href="/icons/tiktok.svg" height="24" width="24" />
                                            </svg>}
                                        />
                                        <Button
                                            type="link"
                                            icon={<svg height="24" width="24">
                                                <image href="/icons/discord.svg" height="24" width="24" />
                                            </svg>}
                                        />
                                        <ThemeButton />
                                    </div>
                                    {getLoginButton()}
                                </div>
                            </Col>
                        </Row>
                    </CardComponent>
                    <LoginModal open={loginModalOpen} onClose={onCloseLoginModal} />
                    <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
                </div >
            </BrowserView>
            <MobileView>
                <div className={styles.headerContainerMobile}>
                    <Flex vertical={false} align='center' style={{ height: "100%" }}>
                        <div className={styles.headerContainerMobileItem} onClick={() => navigate("/")}>
                            <HomeOutlined />
                        </div>
                        <div className={styles.headerContainerMobileItem} onClick={() => navigate("/players")}>
                            <BorderlessTableOutlined />
                        </div>
                        <div className={styles.headerContainerMobileItem} onClick={() => navigate("/games")}>
                            <CloudServerOutlined />
                        </div>
                        <div className={styles.headerContainerMobileItem}>
                            {getLoginMobileButton()}
                        </div>
                    </Flex>
                </div>
            </MobileView>
        </>
    )
}

export default Header;