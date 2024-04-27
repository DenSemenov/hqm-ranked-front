
import { App, Avatar, Button, Col, Popover, Row, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css'
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAdmin, selectIsAuth, setCurrentUser, setIsAuth } from 'stores/auth';
import { getCurrentUser } from 'stores/auth/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import ChangePasswordModal from './ChangePasswordModal';
import { selectCurrentSeason, selectSeasons, setCurrentSeason } from 'stores/season';
import { useNavigate } from 'react-router-dom';
import ThemeButton from './ThemeButton';

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);
    const seasons = useSelector(selectSeasons);
    const currentSeason = useSelector(selectCurrentSeason);

    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth) {
            dispatch(getCurrentUser());
        }
    }, [isAuth])

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

    const loginPage = () => {
        navigate("/login")
    }

    const avatarName = useMemo(() => {
        return (currentUser && currentUser.name) ? currentUser.name[0].toUpperCase() : "";
    }, [currentUser])

    const loginButton = useMemo(() => {
        if (userName && currentUser) {
            return <Avatar shape='square' style={{ cursor: "pointer" }} src={process.env.REACT_APP_API_URL + "/avatars/" + currentUser.id + ".png"} onClick={() => navigate("/profile")}>{avatarName}</Avatar>
        } else {
            return <Button icon={<UserOutlined />} onClick={loginPage} />
        }
    }, [currentUser, userName, avatarName])

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
            <Row style={{ height: 42, borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
                <Col sm={8} xs={6} className={styles.headerContainerLogo}>
                    <span onClick={() => navigate("/")}>
                        <svg height="36" width="36">
                            <image href="/icons/logo.svg" height="36" width="36" />
                        </svg>
                    </span>
                </Col>
                <Col sm={8} xs={12} className={styles.headerContainerItems}>
                    <Select
                        onChange={(value: string) => dispatch(setCurrentSeason(value))}
                        value={currentSeason}
                        options={seasonItems}
                    />
                </Col>
                <Col sm={8} xs={6}>
                    <div className={styles.headerContainerLogin}>
                        {/* <BrowserView>
                            <Button
                                type="link"
                                icon={<svg height="24" width="24">
                                    <image href="/icons/discord.svg" height="24" width="24" />
                                </svg>}
                            />
                        </BrowserView> */}
                        <ThemeButton />
                        {loginButton}
                    </div>
                </Col>
            </Row>
            <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
        </ >
    )
}

export default Header;