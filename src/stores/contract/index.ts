import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IContractResponse } from "models/IContractResponse";
import { RootState } from "stores"

export interface IContractState {
    contracts: IContractResponse[];
}

const initialState: IContractState = {
    contracts: [],
}

export const contractSlicer = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setContracts: (state: IContractState, action: PayloadAction<IContractResponse[]>) => {
            state.contracts = action.payload;
        },
    },
})

export const {
    setContracts,
} =
    contractSlicer.actions


export const selectContracts = (state: RootState) => state.contract.contracts;

export default contractSlicer.reducer
