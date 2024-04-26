import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAdminServer } from "models/IAdminServer";
import { IAuthResponse } from "models/IAuthResponse"
import { ICurrentUserResponse } from "models/ICurrentUserResponse";
import { RootState } from "stores"

export interface IAdminState {
    servers: IAdminServer[]
}

const initialState: IAdminState = {
    servers: []
}

export const adminSlicer = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setServers: (state: IAdminState, action: PayloadAction<IAdminServer[]>) => {
            state.servers = action.payload;
        },
    },
})

export const {
    setServers
} =
    adminSlicer.actions

export const selectServers = (state: RootState) => state.admin.servers;

export default adminSlicer.reducer
