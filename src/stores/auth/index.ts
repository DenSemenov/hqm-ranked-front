import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAuthResponse } from "models/IAuthResponse"
import { ICurrentUserResponse } from "models/ICurrentUserResponse";
import { RootState } from "stores"

export interface IAuthState {
    isAuth: boolean,
    currentUser: ICurrentUserResponse | null;
}

const initialState: IAuthState = {
    isAuth: false,
    currentUser: null
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
            state.currentUser = action.payload;
        },
    },
})

export const {
    setIsAuth,
    setCurrentUser
} =
    authSlicer.actions

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;

export default authSlicer.reducer
