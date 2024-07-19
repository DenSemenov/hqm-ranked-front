import { createAsyncThunk } from "@reduxjs/toolkit"
import ContractService from "services/ContractService"
import { setCoins, setContracts } from "."
import { ISelectContractRequest } from "models/ISelectContractRequest"

export const getContracts = createAsyncThunk('contract/getContracts', async (payload: void, thunkApi) => {
    try {
        const response = await ContractService.getContracts()

        thunkApi.dispatch(setContracts(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const selectContract = createAsyncThunk('contract/selectContract', async (payload: ISelectContractRequest, thunkApi) => {
    try {
        const response = await ContractService.selectContract(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getCoins = createAsyncThunk('contract/getCoins', async (payload: void, thunkApi) => {
    try {
        const response = await ContractService.getCoins()

        thunkApi.dispatch(setCoins(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})