import { createAsyncThunk } from "@reduxjs/toolkit"
import SeasonService from "services/SeasonService"
import { setCurrentGameData, setCurrentPlayerData, setCurrentSeasonGames, setCurrentSeasonStats, setRules, setSeasons, setStorageUrl, setStories } from "."
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest"
import { IPlayerRequest } from "models/IPlayerRequest"
import { IGameRequest } from "models/IGameRequest"
import { IReplayRequest } from "models/IReplayRequest"
import { IReplayViewerRequest } from "models/IReplayViewerRequest"
import { IStoryReplayViewerRequest } from "models/IStoryReplayViewerRequest"

export const getSeasons = createAsyncThunk('season/getSeasons', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getSeasons()

        thunkApi.dispatch(setSeasons(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getSeasonsStats = createAsyncThunk('season/getSeasonsStats', async (payload: ICurrentSeasonStatsRequest, thunkApi) => {
    try {
        const response = await SeasonService.getSeasonsStats(payload)

        thunkApi.dispatch(setCurrentSeasonStats(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getSeasonsGames = createAsyncThunk('season/getSeasonsGames', async (payload: ICurrentSeasonStatsRequest, thunkApi) => {
    try {
        const response = await SeasonService.getSeasonsGames(payload)

        thunkApi.dispatch(setCurrentSeasonGames(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getPlayerData = createAsyncThunk('season/getPlayerData', async (payload: IPlayerRequest, thunkApi) => {
    try {
        thunkApi.dispatch(setCurrentPlayerData(null))
        const response = await SeasonService.getPlayerData(payload)

        thunkApi.dispatch(setCurrentPlayerData(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getGameData = createAsyncThunk('season/getGameData', async (payload: IGameRequest, thunkApi) => {
    try {
        thunkApi.dispatch(setCurrentGameData(null))
        const response = await SeasonService.getGameData(payload)

        thunkApi.dispatch(setCurrentGameData(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})
export const getRules = createAsyncThunk('season/getRules', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getRules()

        thunkApi.dispatch(setRules(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getReplay = createAsyncThunk('replay/getReplay', async (payload: IReplayRequest, thunkApi) => {
    try {
        const response = await SeasonService.getReplay(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getReplayViewer = createAsyncThunk('replay/getReplayViewer', async (payload: IReplayViewerRequest, thunkApi) => {
    try {
        const response = await SeasonService.getReplayViewer(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getReplayGoals = createAsyncThunk('replay/getReplayGoals', async (payload: IReplayRequest, thunkApi) => {
    try {
        const response = await SeasonService.getReplayGoals(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getReplayChatMessages = createAsyncThunk('replay/getReplayChatMessages', async (payload: IReplayRequest, thunkApi) => {
    try {
        const response = await SeasonService.getReplayChatMessages(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getReplayHighlights = createAsyncThunk('replay/getReplayHighlights', async (payload: IReplayRequest, thunkApi) => {
    try {
        const response = await SeasonService.getReplayHighlights(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getStorage = createAsyncThunk('season/getStorage', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getStorage()

        thunkApi.dispatch(setStorageUrl(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getStories = createAsyncThunk('replay/getStories', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getStories()

        thunkApi.dispatch(setStories(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const getStoryReplayViewer = createAsyncThunk('replay/getStoryReplayViewer', async (payload: IStoryReplayViewerRequest, thunkApi) => {
    try {
        const response = await SeasonService.getStoryReplayViewer(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

