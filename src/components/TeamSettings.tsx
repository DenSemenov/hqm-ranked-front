import { Button, Col, Dropdown, List, MenuProps, Modal, Row, Tag, Typography, Upload, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, selectIsAuth } from "stores/auth";
import { selectTeamsState } from "stores/teams";
import styles from './TeamSettings.module.css'
import PlayerItem from "shared/PlayerItem";
import { MoreOutlined } from "@ant-design/icons";
import { ITeamsStateCurrentPlayerResponse } from "models/ITeamsStateResponse";
import { convertMoney } from "shared/MoneyCoverter";
import { getTeamsState, makeAssistant, makeCaptain, sellPlayer } from "stores/teams/async-actions";
import { setClearImageCache } from "stores/season";

const { Text, Title } = Typography;

const TeamSettings = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const teamsState = useSelector(selectTeamsState);
    const currentUser = useSelector(selectCurrentUser);

    const [modal, contextHolder] = Modal.useModal();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (!isAuth && !(teamsState.isCaptain || teamsState.isAssistant)) {
            navigate("/")
        }
    }, [isAuth, teamsState])

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        dispatch(setClearImageCache(new Date()))
    };

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

    const getActions = (item: ITeamsStateCurrentPlayerResponse) => {
        let items: MenuProps['items'] = [];
        if (teamsState.isCaptain) {
            items.push({
                key: "captain",
                label: "Make captain"
            })
            if (item.id !== teamsState.assistantId) {
                items.push({
                    key: "assistant",
                    label: "Make assistant"
                })
            }
        } else if (teamsState.isAssistant) {
            if (item.id !== teamsState.assistantId) {
                items.push({
                    key: "assistant",
                    label: "Make assistant"
                })
            }
        }

        items.push({
            key: "sell",
            label: "Sell"
        })

        return items;
    }

    const onSellPlayer = (playerId: number) => {
        dispatch(sellPlayer({
            playerId: playerId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
        })
    }

    const onMakeCaptain = (playerId: number) => {
        dispatch(makeCaptain({
            playerId: playerId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
        })
    }

    const onMakeAssistant = (playerId: number) => {
        dispatch(makeAssistant({
            playerId: playerId
        })).unwrap().then(() => {
            dispatch(getTeamsState())
        })
    }

    const onAction = async (info: any, item: ITeamsStateCurrentPlayerResponse) => {
        switch (info.key) {
            case "captain":
                const confirmedC = await modal.confirm({
                    title: "Are you sure you want to make " + item.name + " as captain?",
                    okText: "Make captain"
                });
                if (confirmedC) {
                    onMakeCaptain(item.id)
                }
                break;
            case "assistant":
                const confirmedA = await modal.confirm({
                    title: "Are you sure you want to make " + item.name + " as assistant?",
                    okText: "Make assistant"
                });
                if (confirmedA) {
                    onMakeAssistant(item.id)
                }
                break;
            case "sell":
                const confirmedS = await modal.confirm({
                    title: "Are you sure you want to sell " + item.name + " for " + convertMoney(item.cost) + "?",
                    okText: "Sell"
                });
                if (confirmedS) {
                    onSellPlayer(item.id)
                }
                break;
        }
    }

    return (
        <Row style={{ padding: isMobile ? 16 : 0 }}>
            <Col sm={7} xs={0} />
            <Col sm={10} xs={24}>
                <div className={styles.form}>
                    <ImgCrop rotationSlider>
                        <Upload
                            action={process.env.REACT_APP_API_URL + "/api/Teams/UploadAvatar"}
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
                </div>
                <Title level={3}>Players</Title>
                <List
                    itemLayout="horizontal"
                    bordered
                    dataSource={teamsState.team?.players}
                    renderItem={(item, index) => (
                        <List.Item className={styles.playerItem}>
                            <PlayerItem id={item.id} name={item.name} />
                            <div className={styles.actions}>

                                {item.id === teamsState.captainId &&
                                    <Tag>Captain</Tag>
                                }
                                {item.id === teamsState.assistantId &&
                                    <Tag>Assistant</Tag>
                                }
                                <Text type="secondary">{convertMoney(item.cost)}</Text>
                                {currentUser && item.id !== currentUser.id && item.id !== teamsState.captainId &&
                                    <Dropdown menu={{ items: getActions(item), onClick: (info) => onAction(info, item) }} placement="bottomLeft">
                                        <Button icon={<MoreOutlined />} type="text" />
                                    </Dropdown>
                                }
                            </div>
                        </List.Item>
                    )}
                />
                {contextHolder}
            </Col>
        </Row>
    )
}

export default TeamSettings;