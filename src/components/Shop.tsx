import { Avatar, Button, Card, Col, Menu, Row, Tabs } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { IShopItemResponse, ShopItemGroup, ShopItemType } from "models/IShopItemResponse";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectShopItems } from "stores/shop";
import { getShopItems, getShopSelects, purchaseShopItem, selectShopItem } from "stores/shop/async-actions";
import { RxAvatar } from "react-icons/rx";
import { TbBackground } from "react-icons/tb";
import { GiWoodFrame } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { selectCurrentUser } from "stores/auth";
import { selectStorageUrl } from "stores/season";
import { getCoins } from "stores/contract/async-actions";
import { selectCoins } from "stores/contract";
import { isMobile } from "react-device-detect";
import { CiCircleCheck } from "react-icons/ci";
import Meta from "antd/es/card/Meta";

const Shop = () => {
    const dispatch = useAppDispatch();

    const shopItems = useSelector(selectShopItems);
    const currentUser = useSelector(selectCurrentUser);
    const storageUrl = useSelector(selectStorageUrl);
    const coins = useSelector(selectCoins);

    useEffect(() => {
        dispatch(getShopItems());
        dispatch(getCoins());
    }, []);

    const getClipPath = (previewType: ShopItemType) => {
        if (previewType) {
            switch (previewType) {
                case ShopItemType.Hexagon:
                    return "hexagon";
                case ShopItemType.Pacman:
                    return "pacman";
                case ShopItemType.Rhomb:
                    return "rhomb";
                case ShopItemType.Star:
                    return "star";
                case ShopItemType.Square:
                    return "square";
                case ShopItemType.Heart:
                    return "heart";
                default:
                    return "circle";
            }
        } else {
            return "circle";
        }
    }

    const getAvatar = (previewType: ShopItemType) => {
        const clip = getClipPath(previewType);

        return <Avatar
            style={{ clipPath: "url(#" + clip + ")" }}
            size={36}
            shape="square"
            src={currentUser?.id ? storageUrl + "images/" + currentUser.id + ".png" : "/icons/avatar-template.jpg"}
        >

        </Avatar>
    }

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

    const getBackground = (previewType: ShopItemType) => {
        const bClass = getBackgroundClass(previewType);

        return <div
            style={{
                width: 200,
                height: 150,
                borderRadius: 16
            }}
            className={bClass}
        />
    }

    const getBorderClass = (previewType: ShopItemType) => {
        if (previewType) {
            switch (previewType) {
                case ShopItemType.Lightning:
                    return "brLightning";
                case ShopItemType.Rain:
                    return "brRain";
                case ShopItemType.Sphere:
                    return "brSphere";
                case ShopItemType.Triangles:
                    return "brTriangles";
                case ShopItemType.CircleFrame:
                    return "brCircle";
                default:
                    return "";
            }
        } else {
            return "";
        }
    }

    const getFrame = (previewType: ShopItemType) => {
        const brClass = getBorderClass(previewType);

        return <div className={brClass} style={{ width: 44, height: 44, padding: 4, clipPath: "url(#circle-border)" }} ><Avatar
            size={36}
            shape="circle"
            src={currentUser?.id ? storageUrl + "images/" + currentUser.id + ".png" : "/icons/avatar-template.jpg"}
        >

        </Avatar>
        </div>
    }

    const onPurchaseShopItem = (item: IShopItemResponse) => {
        dispatch(purchaseShopItem({
            id: item.id
        })).unwrap().then(() => {
            dispatch(getShopItems());
            dispatch(getCoins());
        });
    }

    const onSelectShopItem = (id: string | null, group: ShopItemGroup) => {
        dispatch(selectShopItem({
            id: id,
            group: group
        })).unwrap().then(() => {
            dispatch(getShopItems());
            dispatch(getShopSelects());
        });
    }

    const getContentByGroup = (group: ShopItemGroup, type: ShopItemType) => {
        switch (group) {
            case ShopItemGroup.AvatarShape:
                return getAvatar(type)
            case ShopItemGroup.Background:
                return getBackground(type)
            case ShopItemGroup.Frame:
                return getFrame(type)
        }
    }

    const getContent = (group: ShopItemGroup) => {
        const groupItems = shopItems.filter(x => x.group === group);
        const nothingSelected = groupItems.filter(x => x.isSelected).length === 0;
        return <Row gutter={[16, 16]} style={{ paddingTop: isMobile ? 16 : 0 }}>
            <Col sm={8} xs={12}>
                <Card title={"Default"} bordered={false} >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
                        {getContentByGroup(group, ShopItemType.Circle)}
                        <Button type="primary" disabled={nothingSelected} onClick={() => onSelectShopItem(null, group)} >{nothingSelected ? "Selected" : "Select"}</Button>
                    </div>
                </Card>
            </Col>
            {groupItems.map(item => {
                return <Col sm={8} xs={12}>
                    <Card hoverable title={group === ShopItemGroup.AvatarShape ? item.description : undefined} bordered={false} extra={<div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "end" }}>  <FaCoins color={"gold"} />{item.cost}</div>}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
                            {getContentByGroup(group, item.type)}
                            {!item.isPurchased &&
                                <Button type="primary" icon={<FaCartShopping />} disabled={coins < item.cost} onClick={() => onPurchaseShopItem(item)} />
                            }
                            {item.isPurchased &&
                                <Button type="primary" disabled={item.isSelected} onClick={() => onSelectShopItem(item.id, group)} >{item.isSelected ? "Selected" : "Select"}</Button>
                            }
                        </div>
                    </Card>
                </Col>
            })
            }

        </Row >
    }

    return <Tabs
        tabPosition={isMobile ? "top" : "left"}
        style={{ height: "100%" }}
        items={[
            {
                label: "Avatar shape",
                key: "shape",
                icon: <RxAvatar />,
                children: getContent(ShopItemGroup.AvatarShape)
            },
            {
                label: "Avatar border",
                key: "border",
                icon: <GiWoodFrame />,
                children: getContent(ShopItemGroup.Frame)
            },
            {
                label: "Profile background",
                key: "background",
                icon: <TbBackground />,
                children: getContent(ShopItemGroup.Background)
            }
        ]}
        tabBarExtraContent={<div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "end", padding: 8, borderRadius: 8 }}>
            <FaCoins color={"gold"} />
            {coins}
        </div>}
    />
}

export default Shop;