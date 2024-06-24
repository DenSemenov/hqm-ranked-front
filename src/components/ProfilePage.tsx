import { Button, Col, Divider, Row, Upload, UploadFile, UploadProps } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { selectCurrentUser, selectIsAdmin, selectIsAuth, selectWebsiteSettings, setCurrentUser, setIsAuth } from "stores/auth";
import styles from './ProfilePage.module.css'
import ChangePasswordModal from "./ChangePasswordModal";
import ImgCrop from "antd-img-crop";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChangeNicknameModal from "./ChangeNicknameModal";
import { isMobile } from "react-device-detect";
import { setClearImageCache } from "stores/season";
import { EditOutlined, KeyOutlined, NotificationOutlined, LogoutOutlined, CloseOutlined } from "@ant-design/icons";
import { TbBrandDiscord } from "react-icons/tb";
import { getCurrentUser, removeDiscord } from "stores/auth/async-actions";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const isAdmin = useSelector(selectIsAdmin);
    const websiteSettings = useSelector(selectWebsiteSettings);
    const currentUser = useSelector(selectCurrentUser);

    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);
    const [changeNicknameModalOpen, setChangeNicknameModalOpen] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (!isAuth) {
            navigate("/")
        }
    }, [!isAuth])

    const onLogout = () => {
        dispatch(setCurrentUser(null));
        dispatch(setIsAuth({
            success: false,
            token: ''
        }));
    }

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as any);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onCloseChangePasswordModal = () => {
        setChangePasswordModalOpen(false);
    }

    const onCloseChangeNicknameModal = () => {
        setChangeNicknameModalOpen(false);
    }

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        dispatch(setClearImageCache(new Date()))
    };

    const onConnectDiscord = () => {
        const redirect = window.origin + "/discordlogin";
        window.location.href = "https://discord.com/api/oauth2/authorize?client_id=" + websiteSettings.discordAppClientId + "&redirect_uri=" + redirect + "&response_type=token&scope=identify";
    }

    const onDisconnectDiscord = () => {
        dispatch(removeDiscord()).unwrap().then(() => {
            dispatch(getCurrentUser());

        })
    }

    return (
        <Row style={{ padding: isMobile ? 16 : 0 }}>
            <Col sm={7} xs={0} />
            <Col sm={10} xs={24}>
                <div className={styles.form}>
                    <ImgCrop rotationSlider>
                        <Upload
                            action={process.env.REACT_APP_API_URL + "/api/Player/UploadAvatar"}
                            method={"POST"}
                            headers={{
                                Authorization: "Bearer " + localStorage.getItem("token")
                            }}
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                    <Button icon={<EditOutlined />} onClick={() => setChangeNicknameModalOpen(true)}>Change nickname</Button>
                    <Button icon={<KeyOutlined />} onClick={() => setChangePasswordModalOpen(true)}>Change password</Button>

                    <Button icon={<NotificationOutlined />} onClick={() => navigate("/notifications")}>Notifications settings</Button>
                    {currentUser?.discordLogin === "" &&
                        <Button icon={<TbBrandDiscord style={{ marginTop: 2 }} />} onClick={onConnectDiscord}>Connect Discord</Button>
                    }
                    {currentUser?.discordLogin !== "" &&
                        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                            <Button style={{ width: "calc(-32px + 100%)" }} icon={<TbBrandDiscord style={{ marginTop: 2 }} />} >{currentUser?.discordLogin}</Button>
                            <Button icon={<CloseOutlined />} onClick={onDisconnectDiscord} />
                        </div>
                    }
                    <Divider />
                    <Button icon={<LogoutOutlined />} danger onClick={onLogout}>Log out</Button>

                    {isAdmin &&
                        <>
                            <Divider />
                            <Button onClick={() => navigate("/admin")}>Admin</Button>
                        </>
                    }
                </div>
            </Col>
            <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
            <ChangeNicknameModal open={changeNicknameModalOpen} onClose={onCloseChangeNicknameModal} />
        </Row>
    )
}

export default ProfilePage;