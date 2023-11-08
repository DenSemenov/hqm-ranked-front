import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IActiveServerResponse } from "models/IActiveServerResponse";
import { RootState } from "stores"

export interface IServerState {
    servers: IActiveServerResponse[];
}

const initialState: IServerState = {
    servers: [],
}

export const serverSlicer = createSlice({
    name: 'server',
    initialState,
    reducers: {
        setServers: (state: IServerState, action: PayloadAction<IActiveServerResponse[]>) => {
            state.servers = action.payload;
        },
    },
})

export const {
    setServers,
} =
    serverSlicer.actions


export const selectServers = (state: RootState) => state.server.servers;

export default serverSlicer.reducer
