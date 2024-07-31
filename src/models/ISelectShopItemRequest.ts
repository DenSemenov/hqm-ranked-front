import { ShopItemGroup } from "./IShopItemResponse";

export interface ISelectShopItemRequest {
    id: string | null;
    group: ShopItemGroup;
}