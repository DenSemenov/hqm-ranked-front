
import { Avatar, Badge, Button, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css'
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuth } from 'stores/auth';
import { getCurrentUser } from 'stores/auth/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import ChangePasswordModal from './ChangePasswordModal';
import { selectCurrentSeason, selectSeasons, selectStorageUrl } from 'stores/season';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeButton from './ThemeButton';
import { isMobile } from 'react-device-detect';

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector(selectCurrentUser);
    const storageUrl = useSelector(selectStorageUrl);
    const currentSeason = useSelector(selectCurrentSeason);
    const seasons = useSelector(selectSeasons);

    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth) {
            dispatch(getCurrentUser());
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
                {loginButton}
            </div>
            <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
        </ >
    )
}

export default Header;