import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IContractResponse } from "models/IContractResponse";
import { RootState } from "stores"

export interface IContractState {
    contracts: IContractResponse[];
    coins: number;
}

const initialState: IContractState = {
    contracts: [],
    coins: 0
}

export const contractSlicer = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setContracts: (state: IContractState, action: PayloadAction<IContractResponse[]>) => {
            state.contracts = action.payload;
        },
        setCoins: (state: IContractState, action: PayloadAction<number>) => {
            state.coins = action.payload;
        },
    },
})

export const {
    setContracts,
    setCoins
} =
    contractSlicer.actions


export const selectContracts = (state: RootState) => state.contract.contracts;
export const selectCoins = (state: RootState) => state.contract.coins;

export default contractSlicer.reducer
