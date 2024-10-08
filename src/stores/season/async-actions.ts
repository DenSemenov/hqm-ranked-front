import { createAsyncThunk } from "@reduxjs/toolkit"
import SeasonService from "services/SeasonService"
import { setCurrentGameData, setCurrentPlayerData, setCurrentPlayerLiteData, setCurrentSeasonGames, setCurrentSeasonStats, setHomeStats, setMainStories, setPatrols, setRules, setSeasons, setStorageUrl, setStories, setTopStats } from "."
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest"
import { IPlayerRequest } from "models/IPlayerRequest"
import { IGameRequest } from "models/IGameRequest"
import { IReplayRequest } from "models/IReplayRequest"
import { IReplayViewerRequest } from "models/IReplayViewerRequest"
import { IStoryReplayViewerRequest } from "models/IStoryReplayViewerRequest"
import { IStoryLikeRequest } from "models/IStoryLikeRequest"
import { IReportRequest } from "models/IReportRequest"
import { IReportViewerRequest } from "models/IReportViewerRequest"
import { IReportReportCancelRequest } from "models/IReportReportCancelRequest"

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

export const getPlayerLiteData = createAsyncThunk('season/getPlayerLiteData', async (payload: IPlayerRequest, thunkApi) => {
    try {
        thunkApi.dispatch(setCurrentPlayerLiteData(null))
        const response = await SeasonService.getPlayerLiteData(payload)

        thunkApi.dispatch(setCurrentPlayerLiteData(response.data))

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

export const getMainStories = createAsyncThunk('season/getMainStories', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getMainStories()

        thunkApi.dispatch(setMainStories(response.data))

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

export const getStoryReplayViewerJson = createAsyncThunk('replay/getStoryReplayViewerJson', async (payload: string, thunkApi) => {
    try {
        const response = await SeasonService.getStoryReplayViewerJson(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const likeStory = createAsyncThunk('replay/likeStory', async (payload: IStoryLikeRequest, thunkApi) => {
    try {
        const response = await SeasonService.likeStory(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getTopStats = createAsyncThunk('season/getTopStats', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getTopStats()

        thunkApi.dispatch(setTopStats(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const report = createAsyncThunk('season/report', async (payload: IReportRequest, thunkApi) => {
    try {
        const response = await SeasonService.report(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const reportDecision = createAsyncThunk('season/reportDecision', async (payload: IReportReportCancelRequest, thunkApi) => {
    try {
        const response = await SeasonService.reportDecision(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getPatrol = createAsyncThunk('season/getPatrol', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getPatrol()

        thunkApi.dispatch(setPatrols(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getReportViewer = createAsyncThunk('replay/getReportViewer', async (payload: IReportViewerRequest, thunkApi) => {
    try {
        const response = await SeasonService.getReportViewer(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getHomeStats = createAsyncThunk('replay/getHomeStats', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getHomeStats()

        thunkApi.dispatch(setHomeStats(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})


export const processHrpLocal = createAsyncThunk('replay/processHrpLocal', async (payload: any, thunkApi) => {
    try {
        const response = await SeasonService.processHrpLocal(payload)

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

