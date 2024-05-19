import { useAppDispatch } from "hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import styles from './Footer.module.css'
import { TableOutlined, UserOutlined, UnorderedListOutlined, DatabaseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Avatar, Button } from "antd";
import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { selectIsAuth, selectCurrentUser } from "stores/auth";
import { selectStorageUrl } from "stores/season";

const Footer = () => {
    const navigate = useNavigate();

    const currentUser = useSelector(selectCurrentUser);
    const storageUrl = useSelector(selectStorageUrl);

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

    const loginPage = () => {
        navigate("/login")
        setCurrentPage("auth")
    }

    const loginButton = useMemo(() => {
        if (userName && currentUser) {
            return <Avatar shape='square' style={{ cursor: "pointer", borderColor: currentPage === "auth" ? "#1677FF" : "transparent" }} src={storageUrl + "images/" + currentUser.id + ".png"} onClick={() => {
                navigate("/profile")
                setCurrentPage("auth")
            }}>{avatarName}</Avatar>
        } else {
            return <Button icon={<UserOutlined className={styles.icon} style={{ color: currentPage === "auth" ? "#1677FF" : "white" }} />} type="text" onClick={loginPage} />
        }
    }, [isMobile, currentUser, userName, avatarName, currentPage])

    return (
        <div className={styles.footerItems}>
            <Button
                icon={<TableOutlined className={styles.icon} style={{ color: currentPage === "players" ? "#1677FF" : "white" }} />}
                type="text"
                onClick={() => {
                    navigate("/")
                    setCurrentPage("players")
                }}
            />
            <Button
                icon={<UnorderedListOutlined className={styles.icon} style={{ color: currentPage === "games" ? "#1677FF" : "white" }} />}
                type="text"
                onClick={() => {
                    navigate("/games")
                    setCurrentPage("games")
                }}
            />
            <Button
                icon={<DatabaseOutlined />} className={styles.icon} style={{ color: currentPage === "servers" ? "#1677FF" : "white" }}
                type="text"
                onClick={() => {
                    navigate("/servers")
                    setCurrentPage("servers")
                }}
            />
            <Button
                icon={<InfoCircleOutlined />} className={styles.icon} style={{ color: currentPage === "other" ? "#1677FF" : "white" }}
                type="text"
                onClick={() => {
                    navigate("/other")
                    setCurrentPage("other")
                }}
            />
            {loginButton}
        </ div>
    )
}

export default Footer;