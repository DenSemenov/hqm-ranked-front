import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IShopItemResponse } from "models/IShopItemResponse";
import { IShopSelectResponse } from "models/IShopSelectResponse";
import { RootState } from "stores"

export interface IShopState {
    shopItems: IShopItemResponse[];
    shopSelects: IShopSelectResponse[]
}

const initialState: IShopState = {
    shopItems: [],
    shopSelects: []
}

export const shopSlicer = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        setShopItems: (state: IShopState, action: PayloadAction<IShopItemResponse[]>) => {
            state.shopItems = action.payload;
        },
        setShopSelects: (state: IShopState, action: PayloadAction<IShopSelectResponse[]>) => {
            state.shopSelects = action.payload;
        },
    },
})

export const {
    setShopItems,
    setShopSelects
} =
    shopSlicer.actions


export const selectShopItems = (state: RootState) => state.shop.shopItems;
export const selectShopSelects = (state: RootState) => state.shop.shopSelects;

export default shopSlicer.reducer
