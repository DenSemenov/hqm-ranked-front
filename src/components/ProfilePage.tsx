import { Button, Card, Col, Row, Upload, UploadFile, UploadProps } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { selectIsAdmin, selectIsAuth, setCurrentUser, setIsAuth } from "stores/auth";
import styles from './ProfilePage.module.css'
import ChangePasswordModal from "./ChangePasswordModal";
import ImgCrop from "antd-img-crop";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChangeNicknameModal from "./ChangeNicknameModal";
import { requestForToken } from "../firebase";
import { addPushToken } from "stores/auth/async-actions";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const isAdmin = useSelector(selectIsAdmin);

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
    };

    const onEnablePush = async () => {
        requestForToken().then((token: any) => {
            localStorage.setItem("pushToken", token);
            dispatch(addPushToken({
                token: token
            }));
        });
    }

    return (
        <Row>
            <Col sm={7} xs={0} />
            <Col sm={10} xs={24}>
                <Card title={"Profile"} >
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
                        <Button onClick={() => setChangeNicknameModalOpen(true)}>Change nickname</Button>
                        <Button onClick={() => setChangePasswordModalOpen(true)}>Change password</Button>
                        <Button onClick={onEnablePush}>Enable push</Button>
                        <Button danger onClick={onLogout}>Log out</Button>

                        {isAdmin &&
                            <Button onClick={() => navigate("/admin")}>Admin</Button>
                        }
                    </div>
                </Card>
            </Col>
            <ChangePasswordModal open={changePasswordModalOpen} onClose={onCloseChangePasswordModal} />
            <ChangeNicknameModal open={changeNicknameModalOpen} onClose={onCloseChangeNicknameModal} />
        </Row>
    )
}

export default ProfilePage;