import { createAsyncThunk } from "@reduxjs/toolkit"
import WeeklyTourneyService from "services/WeeklyTourneyService"
import { setCurrentWeeklyTourney, setWeeklyTourney, setWeeklyTourneys } from "."
import { IWeeklyTourneyIdRequest } from "models/IWeeklyTourneyIdRequest";

export const getCurrentWeeklyTourneyId = createAsyncThunk('weeklyTourney/getCurrentWeeklyTourneyId', async (payload: void, thunkApi) => {
    try {
        const response = await WeeklyTourneyService.getCurrentWeeklyTourneyId();

        thunkApi.dispatch(setCurrentWeeklyTourney(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getWeeklyTourney = createAsyncThunk('weeklyTourney/getWeeklyTourney', async (payload: IWeeklyTourneyIdRequest, thunkApi) => {
    try {
        const response = await WeeklyTourneyService.getWeeklyTourney(payload);

        thunkApi.dispatch(setWeeklyTourney(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const getWeeklyTourneys = createAsyncThunk('weeklyTourney/getWeeklyTourneys', async (payload: void, thunkApi) => {
    try {
        const response = await WeeklyTourneyService.getWeeklyTourneys();

        thunkApi.dispatch(setWeeklyTourneys(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const weeklyTourneyRegister = createAsyncThunk('weeklyTourney/weeklyTourneyRegister', async (payload: void, thunkApi) => {
    try {
        const response = await WeeklyTourneyService.weeklyTourneyRegister();

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})