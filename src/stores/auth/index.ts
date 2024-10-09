import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAuthResponse } from "models/IAuthResponse"
import { ICurrentUserResponse } from "models/ICurrentUserResponse";
import { IPlayerMapResponse } from "models/IPlayerMapResponse";
import { IWebsiteSettingsResponse } from "models/IWebsiteSettingsResponse";
import { RootState } from "stores"

export interface IAuthState {
    loadingUser: boolean;
    isAuth: boolean,
    currentUser: ICurrentUserResponse | null;
    theme: string | null
    websiteSettings: IWebsiteSettingsResponse
    playerMap: IPlayerMapResponse[]
    hoveredPosition: {
        x: number,
        y: number
    } | undefined
}

const initialState: IAuthState = {
    loadingUser: true,
    isAuth: false,
    currentUser: null,
    theme: null,
    websiteSettings: {
        discordAppClientId: "",
        discordJoinLink: "",
        telegramJoinLink: ""
    },
    playerMap: [],
    hoveredPosition: undefined
}

export const authSlicer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuth: (state: IAuthState, action: PayloadAction<IAuthResponse>) => {
            if (action.payload.success) {
                localStorage.setItem('token', action.payload.token);
                state.isAuth = true;
            } else {
                localStorage.removeItem('token');
                state.isAuth = false;
            }
        },
        setCurrentUser: (state: IAuthState, action: PayloadAction<ICurrentUserResponse | null>) => {
            if (action.payload && action.payload.name) {
                state.currentUser = action.payload;
                state.loadingUser = false;
                if (state.currentUser) {

                    state.isAuth = true;
                }
            } else {
                state.loadingUser = false;
            }
        },
        setCurrentUserAcceptedRules: (state: IAuthState, action: PayloadAction) => {
            if (state.currentUser) {
                state.currentUser.isAcceptedRules = true;
            }
        },
        setTheme: (state: IAuthState, action: PayloadAction<string>) => {
            state.theme = action.payload;
        },
        setLoadingUser: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.loadingUser = action.payload;
        },
        setWebsiteSettings: (state: IAuthState, action: PayloadAction<IWebsiteSettingsResponse>) => {
            state.websiteSettings = action.payload;
        },
        setPlayerMap: (state: IAuthState, action: PayloadAction<IPlayerMapResponse[]>) => {
            state.playerMap = action.payload;
        },
        setHoveredPosition: (state: IAuthState, action: PayloadAction<{ x: number, y: number } | undefined>) => {
            state.hoveredPosition = action.payload;
        },
    },
})

export const {
    setIsAuth,
    setCurrentUser,
    setTheme,
    setLoadingUser,
    setCurrentUserAcceptedRules,
    setWebsiteSettings,
    setPlayerMap,
    setHoveredPosition
} =
    authSlicer.actions

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectLoadingUser = (state: RootState) => state.auth.loadingUser;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectTheme = (state: RootState) => state.auth.theme;
export const selectIsAdmin = (state: RootState) => state.auth.currentUser ? state.auth.currentUser.role === "admin" : false;
export const selectWebsiteSettings = (state: RootState) => state.auth.websiteSettings;
export const selectPlayerMap = (state: RootState) => state.auth.playerMap;
export const selectHoveredPosition = (state: RootState) => state.auth.hoveredPosition;

export default authSlicer.reducer
