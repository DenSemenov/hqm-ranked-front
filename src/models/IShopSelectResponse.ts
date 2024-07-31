import { ShopItemGroup, ShopItemType } from "./IShopItemResponse";

export interface IShopSelectResponse {
    playerId: number;
    shopItemType: ShopItemType;
    shopItemGroup: ShopItemGroup
}
