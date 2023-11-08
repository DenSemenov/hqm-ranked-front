import { createAsyncThunk } from "@reduxjs/toolkit"
import SeasonService from "services/SeasonService"
import { setCurrentSeasonGames, setCurrentSeasonStats, setSeasons } from "."
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest"

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