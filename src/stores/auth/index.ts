import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAuthResponse } from "models/IAuthResponse"
import { ICurrentUserResponse } from "models/ICurrentUserResponse";
import { RootState } from "stores"

export interface IAuthState {
    loadingUser: boolean;
    isAuth: boolean,
    currentUser: ICurrentUserResponse | null;
    theme: string | null
}

const initialState: IAuthState = {
    loadingUser: true,
    isAuth: false,
    currentUser: null,
    theme: null
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
    },
})

export const {
    setIsAuth,
    setCurrentUser,
    setTheme,
    setLoadingUser,
    setCurrentUserAcceptedRules
} =
    authSlicer.actions

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectLoadingUser = (state: RootState) => state.auth.loadingUser;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectTheme = (state: RootState) => state.auth.theme;
export const selectIsAdmin = (state: RootState) => state.auth.currentUser ? state.auth.currentUser.role === "admin" : false;

export default authSlicer.reducer
