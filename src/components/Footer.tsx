import { useNavigate } from "react-router-dom";
import styles from './Footer.module.css'
import { TableOutlined, UserOutlined, UnorderedListOutlined, DatabaseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Avatar, Button } from "antd";
import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import { selectClearImageCache, selectStorageUrl } from "stores/season";

const Footer = () => {
    const navigate = useNavigate();

    const currentUser = useSelector(selectCurrentUser);
    const isAuth = useSelector(selectIsAuth);
    const storageUrl = useSelector(selectStorageUrl);
    const clearImageCache = useSelector(selectClearImageCache);

    const [currentPage, setCurrentPage] = useState<string>("players");

    const userName = useMemo(() => {
        if (currentUser) {
            return currentUser.name;
        } else {
            return null;
        }
    }, [currentUser]);

    const avatarName = useMemo(() => {
        return (currentUser && currentUser.name) ? currentUser.name[0].toUpperCase() : "";
    }, [currentUser])

    const query = useMemo(() => {
        if (clearImageCache) {
            return clearImageCache.getTime();
        }
    }, [clearImageCache])

    const loginButton = useMemo(() => {
        if (userName && currentUser && isAuth) {
            return <div className={styles.footerButton} onClick={() => {
                navigate("/profile")
                setCurrentPage("auth")
            }}
            >
                <Avatar shape='square' style={{ cursor: "pointer", borderColor: currentPage === "auth" ? "#1677FF" : "transparent", borderRadius: 16 }} src={storageUrl + "images/" + currentUser.id + ".png" + "?t=" + query} >{avatarName}</Avatar>
            </div>
        } else {
            return <div className={styles.footerButton} onClick={() => {
                navigate("/login")
                setCurrentPage("auth")
            }}
            >
                <UserOutlined className={styles.icon} style={{ color: currentPage === "auth" ? "#1677FF" : "white" }} />
            </div>
        }
    }, [currentUser, userName, avatarName, currentPage, isAuth, query])

    return (
        <div className={styles.footerItems}>
            <div className={styles.footerButton} onClick={() => {
                navigate("/")
                setCurrentPage("players")
            }}
            >
                <TableOutlined className={styles.icon} style={{ color: currentPage === "players" ? "#1677FF" : "white" }} />
            </div>
            <div className={styles.footerButton} onClick={() => {
                navigate("/games")
                setCurrentPage("games")
            }}
            >
                <UnorderedListOutlined className={styles.icon} style={{ color: currentPage === "games" ? "#1677FF" : "white" }} />
            </div>
            <div className={styles.footerButton} onClick={() => {
                navigate("/servers")
                setCurrentPage("servers")
            }}
            >
                <DatabaseOutlined className={styles.icon} style={{ color: currentPage === "servers" ? "#1677FF" : "white" }} />
            </div>
            <div className={styles.footerButton} onClick={() => {
                navigate("/other")
                setCurrentPage("other")
            }}
            >
                <InfoCircleOutlined className={styles.icon} style={{ color: currentPage === "other" ? "#1677FF" : "white" }} />
            </div>

            {loginButton}
        </ div>
    )
}

export default Footer;