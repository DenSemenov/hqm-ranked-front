import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IActiveServerResponse } from "models/IActiveServerResponse";
import { IHeartbeatResponse } from "models/IHeartbeatResponse";
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
        setUpdatedServer: (state: IServerState, action: PayloadAction<IHeartbeatResponse>) => {
            const server = state.servers.find(x => x.id === action.payload.id);
            if (server) {
                server.name = action.payload.name;
                server.loggedIn = action.payload.loggedIn;
                server.blueScore = action.payload.blueScore;
                server.redScore = action.payload.redScore;
                server.period = action.payload.period;
                server.time = action.payload.time;
                server.teamMax = action.payload.teamMax;
                server.state = action.payload.state;
            }
        },
    },
})

export const {
    setServers,
    setUpdatedServer
} =
    serverSlicer.actions


export const selectServers = (state: RootState) => state.server.servers;

export default serverSlicer.reducer
