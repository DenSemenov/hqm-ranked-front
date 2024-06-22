import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IActiveServerResponse } from "models/IActiveServerResponse";
import { IFreeAgentResponse } from "models/IFreeAgentResponse";
import { IGameInviteResponse } from "models/IGameInviteResponse";
import { IPlayerInviteResponse } from "models/IPlayerInviteResponse";
import { ITeamResponse } from "models/ITeamResponse";
import { ITeamsStateResponse } from "models/ITeamsStateResponse";
import { ITeamsStatsResponse } from "models/ITeamsStatsResponse";
import { RootState } from "stores"

export interface ITeamsState {
    state: ITeamsStateResponse;
    freeAgents: IFreeAgentResponse[]
    invites: IPlayerInviteResponse[],
    currentTeam: ITeamResponse | undefined
    gameInvites: IGameInviteResponse[]
    teamsStats: ITeamsStatsResponse[]
}

const initialState: ITeamsState = {
    state: {
        canCreateTeam: false,
        isCaptain: false,
        isAssistant: false,
        team: undefined,
        teamsMaxPlayers: 4
    },
    freeAgents: [],
    invites: [],
    currentTeam: undefined,
    gameInvites: [],
    teamsStats: []
}

export const teamsSlicer = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        setTeamsState: (state: ITeamsState, action: PayloadAction<ITeamsStateResponse>) => {
            state.state = action.payload;
        },
        setFreeAgents: (state: ITeamsState, action: PayloadAction<IFreeAgentResponse[]>) => {
            state.freeAgents = action.payload;
        },
        setPlayerInvites: (state: ITeamsState, action: PayloadAction<IPlayerInviteResponse[]>) => {
            state.invites = action.payload;
        },
        setCurrentTeam: (state: ITeamsState, action: PayloadAction<ITeamResponse | undefined>) => {
            state.currentTeam = action.payload;
        },
        setGameInvites: (state: ITeamsState, action: PayloadAction<IGameInviteResponse[]>) => {
            state.gameInvites = action.payload;
        },
        setTeamsStats: (state: ITeamsState, action: PayloadAction<ITeamsStatsResponse[]>) => {
            state.teamsStats = action.payload;
        },
    },
})

export const {
    setTeamsState,
    setFreeAgents,
    setPlayerInvites,
    setCurrentTeam,
    setGameInvites,
    setTeamsStats
} =
    teamsSlicer.actions


export const selectTeamsState = (state: RootState) => state.teams.state;
export const selectFreeAgents = (state: RootState) => state.teams.freeAgents;
export const selectPlayerInvites = (state: RootState) => state.teams.invites;
export const selectCurrentTeam = (state: RootState) => state.teams.currentTeam;
export const selectGameInvites = (state: RootState) => state.teams.gameInvites;
export const selectTeamsStats = (state: RootState) => state.teams.teamsStats;

export default teamsSlicer.reducer
