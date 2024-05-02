import { createAsyncThunk } from "@reduxjs/toolkit"
import SeasonService from "services/SeasonService"
import { setCurrentGameData, setCurrentPlayerData, setCurrentSeasonGames, setCurrentSeasonStats, setRules, setSeasons } from "."
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest"
import { IPlayerRequest } from "models/IPlayerRequest"
import { IGameRequest } from "models/IGameRequest"
import { IReplayRequest } from "models/IReplayRequest"

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