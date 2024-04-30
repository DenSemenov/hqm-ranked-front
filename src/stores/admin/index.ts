import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAdminPlayerResponse } from "models/IAdminPlayerResponse";
import { IAdminResponse } from "models/IAdminResponse";
import { IAdminServer } from "models/IAdminServer";
import { RootState } from "stores"

export interface IAdminState {
    servers: IAdminServer[]
    players: IAdminPlayerResponse[];
    admins: IAdminResponse[];
}

const initialState: IAdminState = {
    servers: [],
    players: [],
    admins: []
}

export const adminSlicer = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setServers: (state: IAdminState, action: PayloadAction<IAdminServer[]>) => {
            state.servers = action.payload;
        },
        setPlayers: (state: IAdminState, action: PayloadAction<IAdminPlayerResponse[]>) => {
            state.players = action.payload;
        },
        setAdmins: (state: IAdminState, action: PayloadAction<IAdminResponse[]>) => {
            state.admins = action.payload;
        },
    },
})

export const {
    setServers,
    setPlayers,
    setAdmins
} =
    adminSlicer.actions

export const selectServers = (state: RootState) => state.admin.servers;
export const selectPlayers = (state: RootState) => state.admin.players;
export const selectAdmins = (state: RootState) => state.admin.admins;

export default adminSlicer.reducer