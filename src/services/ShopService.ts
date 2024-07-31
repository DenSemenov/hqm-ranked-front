
import { IShopItemResponse } from "models/IShopItemResponse";
import $api from "../http";
import { AxiosResponse } from 'axios'
import { IPurchaseShopItemRequest } from "models/IPurchaseShopItemRequest";
import { ISelectShopItemRequest } from "models/ISelectShopItemRequest";
import { IShopSelectResponse } from "models/IShopSelectResponse";

export default class ShopService {
    static async getShopItems(): Promise<AxiosResponse<IShopItemResponse[]>> {
        return $api.post<IShopItemResponse[]>('api/shop/GetShopItems');
    }
    static async purchaseShopItem(data: IPurchaseShopItemRequest): Promise<AxiosResponse> {
        return $api.post('api/shop/PurchaseShopItem', data);
    }
    static async selectShopItem(data: ISelectShopItemRequest): Promise<AxiosResponse> {
        return $api.post('api/shop/SelectShopItem', data);
    }
    static async getShopSelects(): Promise<AxiosResponse<IShopSelectResponse[]>> {
        return $api.post<IShopSelectResponse[]>('api/shop/GetShopSelects');
    }
}