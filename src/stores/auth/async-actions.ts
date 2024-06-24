import { createAsyncThunk } from "@reduxjs/toolkit"
import AuthService from "../../services/AuthService"
import { ILoginRequest } from "../../models/ILoginRequest"
import { setCurrentUser, setIsAuth, setWebsiteSettings } from "."
import { IChangePasswordRequest } from "models/IChangePasswordRequest"
import { IRegisterRequest } from "models/IRegisterRequest"
import { notification } from "antd"
import { IChangeNicknameRequest } from "models/IChangeNicknameRequest"
import { IPushTokenRequest } from "models/IPushTokenRequest"
import { IPlayerNotificationsResponse } from "models/IPlayerNotificationsResponse"
import { IDiscordAuthRequest } from "models/IDiscordAuthRequest"

export const login = createAsyncThunk('auth/login', async (payload: ILoginRequest, thunkApi) => {
    try {
        const response = await AuthService.login(payload)

        thunkApi.dispatch(setIsAuth(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const loginWithDiscord = createAsyncThunk('auth/loginWithDiscord', async (payload: IDiscordAuthRequest, thunkApi) => {
    try {
        const response = await AuthService.loginWithDiscord(payload)

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

export const changeNickname = createAsyncThunk('auth/changeNickname', async (payload: IChangeNicknameRequest, thunkApi) => {
    try {
        const response = await AuthService.changeNickname(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const addPushToken = createAsyncThunk('auth/addPushToken', async (payload: IPushTokenRequest, thunkApi) => {
    try {
        const response = await AuthService.addPushToken(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})



export const removePushToken = createAsyncThunk('auth/removePushToken', async (payload: IPushTokenRequest, thunkApi) => {
    try {
        const response = await AuthService.removePushToken(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getPlayerNotifications = createAsyncThunk('auth/getPlayerNotifications', async (payload: void, thunkApi) => {
    try {
        const response = await AuthService.getPlayerNotifications()

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const savePlayerNotifications = createAsyncThunk('auth/savePlayerNotifications', async (payload: IPlayerNotificationsResponse, thunkApi) => {
    try {
        const response = await AuthService.savePlayerNotifications(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const acceptRules = createAsyncThunk('auth/acceptRules', async (payload: void, thunkApi) => {
    try {
        const response = await AuthService.acceptRules()

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getWebsiteSettings = createAsyncThunk('auth/getWebsiteSettings', async (payload: void, thunkApi) => {
    try {
        const response = await AuthService.getWebsiteSettings()

        thunkApi.dispatch(setWebsiteSettings(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const setDiscordByToken = createAsyncThunk('auth/setDiscordByToken', async (payload: IDiscordAuthRequest, thunkApi) => {
    try {
        const response = await AuthService.setDiscordByToken(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const removeDiscord = createAsyncThunk('auth/removeDiscord', async (payload: void, thunkApi) => {
    try {
        const response = await AuthService.removeDiscord()

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})