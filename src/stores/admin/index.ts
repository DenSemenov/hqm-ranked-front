import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAdminPlayerResponse } from "models/IAdminPlayerResponse";
import { IAdminResponse } from "models/IAdminResponse";
import { IAdminServer } from "models/IAdminServer";
import { IAdminStoryResponse } from "models/IAdminStoryResponse";
import { ISettingsResponse } from "models/ISettingsResponse";
import { RootState } from "stores"

export interface IAdminState {
    servers: IAdminServer[]
    players: IAdminPlayerResponse[];
    admins: IAdminResponse[];
    settings: ISettingsResponse | undefined,
    unapprovedUsers: IAdminPlayerResponse[];
    adminStories: IAdminStoryResponse[]
}

const initialState: IAdminState = {
    servers: [],
    players: [],
    admins: [],
    settings: undefined,
    unapprovedUsers: [],
    adminStories: []
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
        setSettings: (state: IAdminState, action: PayloadAction<ISettingsResponse | undefined>) => {
            state.settings = action.payload;
        },
        setUnapprovedUsers: (state: IAdminState, action: PayloadAction<IAdminPlayerResponse[]>) => {
            state.unapprovedUsers = action.payload;
        },
        setAdminStories: (state: IAdminState, action: PayloadAction<IAdminStoryResponse[]>) => {
            state.adminStories = action.payload;
        },
    },
})

export const {
    setServers,
    setPlayers,
    setAdmins,
    setSettings,
    setUnapprovedUsers,
    setAdminStories
} =
    adminSlicer.actions

export const selectServers = (state: RootState) => state.admin.servers;
export const selectPlayers = (state: RootState) => state.admin.players;
export const selectAdmins = (state: RootState) => state.admin.admins;
export const selectSettings = (state: RootState) => state.admin.settings;
export const selectUnapprovedUsers = (state: RootState) => state.admin.unapprovedUsers;
export const selectAdminStories = (state: RootState) => state.admin.adminStories;

export default adminSlicer.reducer