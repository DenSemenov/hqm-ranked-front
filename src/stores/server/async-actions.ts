import { createAsyncThunk } from "@reduxjs/toolkit"
import ServerService from "services/ServerService"
import { setServers } from "."

export const getActiveServers = createAsyncThunk('season/getActiveServers', async (payload: void, thunkApi) => {
    try {
        const response = await ServerService.getActiveServers()

        thunkApi.dispatch(setServers(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})