import { createAsyncThunk } from "@reduxjs/toolkit"
import AuthService from "../../services/AuthService"
import { ILoginRequest } from "../../models/ILoginRequest"
import { setCurrentUser, setIsAuth } from "."
import { ICurrentUserRequest } from "models/ICurrentUserRequest"
import { IChangePasswordRequest } from "models/IChangePasswordRequest"
import { IRegisterRequest } from "models/IRegisterRequest"
import { notification } from "antd"

export const login = createAsyncThunk('auth/login', async (payload: ILoginRequest, thunkApi) => {
    try {
        const response = await AuthService.login(payload)

        thunkApi.dispatch(setIsAuth(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const register = createAsyncThunk('auth/register', async (payload: IRegisterRequest, thunkApi) => {
    try {
        const response = await AuthService.register(payload)

        if (response.data.success) {
            thunkApi.dispatch(setIsAuth(response.data))
        } else {
            notification.error({
                message: "Nickname exists",
            })
        }

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (payload: void, thunkApi) => {
    try {
        const response = await AuthService.getCurrentUser()
        thunkApi.dispatch(setCurrentUser(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (payload: IChangePasswordRequest, thunkApi) => {
    try {
        const response = await AuthService.changePassword(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})