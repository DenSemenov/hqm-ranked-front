import { createAsyncThunk } from "@reduxjs/toolkit"
import AdminService from "services/AdminService"
import { setAdmins, setPlayers, setServers } from "."
import { IDeleteServerRequest } from "models/IDeleteServerRequest"
import { IAddServerRequest } from "models/IAddServerRequest"
import { IBanUnbanRequest } from "models/IBanUnbanRequest"
import { IAddRemoveAdminRequest } from "models/IAddRemoveAdminRequest"

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

export const getPlayers = createAsyncThunk('admin/getPlayers', async (payload: void, thunkApi) => {
    try {
        const response = await AdminService.getPlayers()

        thunkApi.dispatch(setPlayers(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const banUnban = createAsyncThunk('admin/banUnban', async (payload: IBanUnbanRequest, thunkApi) => {
    try {
        const response = await AdminService.banUnban(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getAdmins = createAsyncThunk('admin/getAdmins', async (payload: void, thunkApi) => {
    try {
        const response = await AdminService.getAdmins()

        thunkApi.dispatch(setAdmins(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const addRemoveAdmin = createAsyncThunk('admin/addRemoveAdmin', async (payload: IAddRemoveAdminRequest, thunkApi) => {
    try {
        const response = await AdminService.addRemoveAdmin(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})