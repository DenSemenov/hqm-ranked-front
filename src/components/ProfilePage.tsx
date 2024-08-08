import { Button, Col, Divider, InputNumber, InputNumberProps, Row, Select, Slider, SliderSingleProps, Switch, Tooltip, Upload, UploadFile, UploadProps } from "antd";
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
import { EditOutlined, KeyOutlined, NotificationOutlined, LogoutOutlined, CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { TbBrandDiscord } from "react-icons/tb";
import { changeLimitType, getCurrentUser, removeDiscord, setShowLocation } from "stores/auth/async-actions";

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
    const [changeLimitValue, setChangeLimitValue] = useState<number>(0);

    useEffect(() => {
        if (!isAuth) {
            navigate("/")
        }
    }, [!isAuth])

    useEffect(() => {
        if (currentUser) {
            setChangeLimitValue(currentUser.limitTypeValue)
        }
    }, [currentUser])

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

    const onSetShowLocation = (value: boolean) => {
        dispatch(setShowLocation({
            showLocation: value
        })).unwrap().then(() => {
            dispatch(getCurrentUser());
        })
    }

    const onChangeLimitTypeValue: InputNumberProps['onChange'] = (newValue: any) => {
        if (newValue as number != undefined) {
            setChangeLimitValue(newValue as number);
            dispatch(changeLimitType({
                limitTypeValue: newValue
            }));
        }
    };

    const onChangeLimitTypeValueComplete: InputNumberProps['onChange'] = (newValue: any) => {
        if (newValue as number != undefined) {
            dispatch(changeLimitType({
                limitTypeValue: newValue
            })).unwrap().then(() => {
                dispatch(getCurrentUser());
            })
        }
    }

    const marks: SliderSingleProps['marks'] = {
        0.0088888891: "old",
        0.01: "new",
        0: "no limit"
    };

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
                    <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                        <Switch style={{ width: "calc(-32px + 100%)" }} checkedChildren={"Hide my location"} unCheckedChildren="Show my location" checked={currentUser?.showLocation} onChange={(e) => onSetShowLocation(e)} />
                        <Tooltip title="Your country and city will be displayed on the player map and in your profile">
                            <Button shape="circle" icon={<InfoCircleOutlined />} size="small" type="text" />
                        </Tooltip>
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                        <Slider
                            style={{ width: "calc(-32px + 100%)" }}
                            min={0}
                            max={0.02}
                            onChange={onChangeLimitTypeValue}
                            onChangeComplete={onChangeLimitTypeValueComplete}
                            value={typeof changeLimitValue === 'number' ? changeLimitValue : 0}
                            step={0.00001}
                            marks={marks}
                        />
                        <InputNumber
                            min={0}
                            max={1}
                            style={{ margin: '0 16px', width: 150 }}
                            value={changeLimitValue}
                            onChange={(e) => {
                                onChangeLimitTypeValue(e);
                                onChangeLimitTypeValueComplete(e);
                            }}
                            step={0.00001}
                        />
                        {/* <Select
                            style={{ width: "calc(-32px + 100%)" }}
                            onChange={onChangeLimitType}
                            options={[
                                { value: LimitType.Default, label: 'Default (from 2011)' },
                                { value: LimitType.New, label: 'New (from 2023)' },
                                { value: LimitType.None, label: 'No limits' },
                            ]}
                            value={currentUser?.limitType}

                        /> */}
                        <Tooltip title="Stick limit type (relogin on server to apply)">
                            <Button shape="circle" icon={<InfoCircleOutlined />} size="small" type="text" />
                        </Tooltip>
                    </div>
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