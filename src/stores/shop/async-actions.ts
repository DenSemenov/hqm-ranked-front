import { createAsyncThunk } from "@reduxjs/toolkit"
import { setShopItems, setShopSelects } from "."
import ShopService from "services/ShopService"
import { IPurchaseShopItemRequest } from "models/IPurchaseShopItemRequest"
import { ISelectShopItemRequest } from "models/ISelectShopItemRequest"

export const getShopItems = createAsyncThunk('shop/getShopItems', async (payload: void, thunkApi) => {
    try {
        const response = await ShopService.getShopItems()

        thunkApi.dispatch(setShopItems(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const purchaseShopItem = createAsyncThunk('shop/purchaseShopItem', async (payload: IPurchaseShopItemRequest, thunkApi) => {
    try {
        const response = await ShopService.purchaseShopItem(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const selectShopItem = createAsyncThunk('shop/selectShopItem', async (payload: ISelectShopItemRequest, thunkApi) => {
    try {
        const response = await ShopService.selectShopItem(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getShopSelects = createAsyncThunk('shop/getShopSelects', async (payload: void, thunkApi) => {
    try {
        const response = await ShopService.getShopSelects()

        thunkApi.dispatch(setShopSelects(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})