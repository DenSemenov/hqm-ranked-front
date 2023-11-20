import { createAsyncThunk } from "@reduxjs/toolkit"
import SeasonService from "services/SeasonService"
import { setCurrentPlayerData, setCurrentSeasonGames, setCurrentSeasonStats, setDivisions, setSeasons } from "."
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest"
import { IDivisionRequest } from "models/IDivisionRequest"
import { IPlayerRequest } from "models/IPlayerRequest"

export const getSeasons = createAsyncThunk('season/getSeasons', async (payload: IDivisionRequest, thunkApi) => {
    try {
        const response = await SeasonService.getSeasons(payload)

        thunkApi.dispatch(setSeasons(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getDivisions = createAsyncThunk('season/getDivisions', async (payload: void, thunkApi) => {
    try {
        const response = await SeasonService.getDivisions()

        thunkApi.dispatch(setDivisions(response.data))

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