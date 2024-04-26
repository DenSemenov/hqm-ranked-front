import { createAsyncThunk } from "@reduxjs/toolkit"
import AdminService from "services/AdminService"
import { setServers } from "."
import { IDeleteServerRequest } from "models/IDeleteServerRequest"
import { IAddServerRequest } from "models/IAddServerRequest"

export const getServers = createAsyncThunk('admin/getServers', async (payload: void, thunkApi) => {
    try {
        const response = await AdminService.getServers()

        thunkApi.dispatch(setServers(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const deleteServer = createAsyncThunk('admin/deleteServer', async (payload: IDeleteServerRequest, thunkApi) => {
    try {
        const response = await AdminService.deleteServer(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const addServer = createAsyncThunk('admin/addServer', async (payload: IAddServerRequest, thunkApi) => {
    try {
        const response = await AdminService.addServer(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})