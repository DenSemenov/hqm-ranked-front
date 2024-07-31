import { Avatar, Row, Col, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentPlayerLiteData, selectStorageUrl } from "stores/season";
import styles from './PlayerItem.module.css'
import { selectShopSelects } from "stores/shop";
import { ShopItemGroup, ShopItemType } from "models/IShopItemResponse";

const { Text, Title } = Typography;


const HoveredPlayerItem = () => {
    const playerLiteData = useSelector(selectCurrentPlayerLiteData);
    const storageUrl = useSelector(selectStorageUrl);
    const shopSelects = useSelector(selectShopSelects);

    const avatarName = useMemo(() => {
        if (playerLiteData) {
            return playerLiteData.name[0].toUpperCase()
        } else {
            return "";
        }
    }, [playerLiteData])

    const getBackgroundClass = (previewType: ShopItemType) => {
        if (previewType) {
            switch (previewType) {
                case ShopItemType.City:
                    return "bgCity";
                case ShopItemType.Solar:
                    return "bgSolar";
                case ShopItemType.SunAndSea:
                    return "bgSun";
                case ShopItemType.DarkSun:
                    return "bgDarkSun";
                case ShopItemType.Solar2:
                    return "bgSolar2";
                case ShopItemType.Tree:
                    return "bgTree";
                default:
                    return "";
            }
        } else {
            return "";
        }
    }

    const bg = useMemo(() => {
        if (playerLiteData) {
            const selected = shopSelects.find(x => x.playerId === playerLiteData.id && x.shopItemGroup === ShopItemGroup.Background)
            if (selected) {
                return getBackgroundClass(selected.shopItemType)
            } else {
                return ""
            }
        } else {
            return "";
        }
    }, [playerLiteData, shopSelects])

    const content = useMemo(() => {
        if (playerLiteData) {
            return <div className={styles.liteData + " " + bg} >
                <Avatar
                    style={{ borderRadius: "16px 0 0 16px" }}
                    size={68}
                    shape='square'
                    src={storageUrl + "images/" + playerLiteData.id + ".png"}
                >
                    {avatarName}
                </Avatar>
                <Row style={{ width: 180 }}>
                    <Col span={24}>
                        <Title level={5}>{playerLiteData.name}</Title>
                    </Col>
                    <Col span={8} style={{ display: "flex", gap: 4 }}>
                        <Text type="secondary">GP</Text>
                        <Text >{playerLiteData.gp}</Text>
                    </Col>
                    <Col span={8} style={{ display: "flex", gap: 4 }}>
                        <Text type="secondary">G</Text>
                        <Text >{playerLiteData.goals}</Text>
                    </Col>
                    <Col span={8} style={{ display: "flex", gap: 4 }}>
                        <Text type="secondary">A</Text>
                        <Text >{playerLiteData.assists}</Text>
                    </Col>
                </Row>
            </div>
        } else {
            return <span />
        }
    }, [playerLiteData])

    return <div>
        {content}
    </div>
}

export default HoveredPlayerItem;