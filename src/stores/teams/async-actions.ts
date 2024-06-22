import { createAsyncThunk } from "@reduxjs/toolkit"
import TeamsService from "services/TeamsService"
import { setCurrentTeam, setFreeAgents, setGameInvites, setPlayerInvites, setTeamsState, setTeamsStats } from ".";
import { ICreateTeamRequest } from "models/ICreateTeamRequest";
import { IInvitePlayerRequest } from "models/IInvitePlayerRequest";
import { ICancelPlayerInviteRequest } from "models/ICancelPlayerInviteRequest";
import { IGetTeamRequest } from "models/IGetTeamRequest";
import { ISellPlayerRequest } from "models/ISellPlayerRequest";
import { IMakeCapOrAssistantRequest } from "models/IMakeCapOrAssistantRequest";
import { ICreateGameInviteRequest } from "models/ICreateGameInviteRequest";
import { IRemoveGameInviteRequest } from "models/IRemoveGameInviteRequest";
import { IVoteGameInviteRequest } from "models/IVoteGameInviteRequest";
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest";
import { setLoading } from "stores/season";

export const getTeamsState = createAsyncThunk('teams/getTeamsState', async (payload: void, thunkApi) => {
    try {
        const response = await TeamsService.getTeamsState();

        thunkApi.dispatch(setTeamsState(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const createTeam = createAsyncThunk('teams/createTeam', async (payload: ICreateTeamRequest, thunkApi) => {
    try {
        thunkApi.dispatch(setLoading(true))
        const response = await TeamsService.createTeam(payload);
        thunkApi.dispatch(setLoading(false))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const leaveTeam = createAsyncThunk('teams/leaveTeam', async (payload: void, thunkApi) => {
    try {
        const response = await TeamsService.leaveTeam();

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getFreeAgents = createAsyncThunk('teams/getFreeAgents', async (payload: void, thunkApi) => {
    try {
        const response = await TeamsService.getFreeAgents();

        thunkApi.dispatch(setFreeAgents(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const invitePlayer = createAsyncThunk('teams/invitePlayer', async (payload: IInvitePlayerRequest, thunkApi) => {
    try {
        const response = await TeamsService.invitePlayer(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const cancelInvite = createAsyncThunk('teams/cancelInvite', async (payload: ICancelPlayerInviteRequest, thunkApi) => {
    try {
        const response = await TeamsService.cancelInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getInvites = createAsyncThunk('teams/getInvites', async (payload: void, thunkApi) => {
    try {
        const response = await TeamsService.getInvites();

        thunkApi.dispatch(setPlayerInvites(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const applyPlayerInvite = createAsyncThunk('teams/applyPlayerInvite', async (payload: ICancelPlayerInviteRequest, thunkApi) => {
    try {
        const response = await TeamsService.applyPlayerInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const declinePlayerInvite = createAsyncThunk('teams/declinePlayerInvite', async (payload: ICancelPlayerInviteRequest, thunkApi) => {
    try {
        const response = await TeamsService.declinePlayerInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const getTeam = createAsyncThunk('teams/getTeam', async (payload: IGetTeamRequest, thunkApi) => {
    try {
        thunkApi.dispatch(setCurrentTeam(undefined))
        const response = await TeamsService.getTeam(payload);

        thunkApi.dispatch(setCurrentTeam(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const sellPlayer = createAsyncThunk('teams/sellPlayer', async (payload: ISellPlayerRequest, thunkApi) => {
    try {
        const response = await TeamsService.sellPlayer(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const makeCaptain = createAsyncThunk('teams/makeCaptain', async (payload: IMakeCapOrAssistantRequest, thunkApi) => {
    try {
        const response = await TeamsService.makeCaptain(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const makeAssistant = createAsyncThunk('teams/makeAssistant', async (payload: IMakeCapOrAssistantRequest, thunkApi) => {
    try {
        const response = await TeamsService.makeAssistant(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const createGameInvite = createAsyncThunk('teams/createGameInvite', async (payload: ICreateGameInviteRequest, thunkApi) => {
    try {
        const response = await TeamsService.createGameInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const removeGameInvite = createAsyncThunk('teams/removeGameInvite', async (payload: IRemoveGameInviteRequest, thunkApi) => {
    try {
        const response = await TeamsService.removeGameInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getGameInvites = createAsyncThunk('teams/getGameInvites', async (payload: void, thunkApi) => {
    try {
        const response = await TeamsService.getGameInvites();

        thunkApi.dispatch(setGameInvites(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const voteGameInvite = createAsyncThunk('teams/voteGameInvite', async (payload: IVoteGameInviteRequest, thunkApi) => {
    try {
        const response = await TeamsService.voteGameInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getTeamsStats = createAsyncThunk('teams/getTeamsStats', async (payload: ICurrentSeasonStatsRequest, thunkApi) => {
    try {
        const response = await TeamsService.getTeamsStats(payload);

        thunkApi.dispatch(setTeamsStats(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})