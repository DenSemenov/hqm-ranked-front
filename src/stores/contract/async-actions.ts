import { createAsyncThunk } from "@reduxjs/toolkit"
import ContractService from "services/ContractService"
import { setContracts } from "."

export const getContracts = createAsyncThunk('contract/getContracts', async (payload: void, thunkApi) => {
    try {
        const response = await ContractService.getContracts()

        thunkApi.dispatch(setContracts(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})