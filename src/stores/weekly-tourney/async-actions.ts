import { createAsyncThunk } from "@reduxjs/toolkit"
import WeeklyTourneyService from "services/WeeklyTourneyService"
import { setCurrentWeeklyTourney, setWeeklyTourney, setWeeklyTourneys } from "."
import { IWeeklyTourneyIdRequest } from "models/IWeeklyTourneyIdRequest";
import { IWeeklyTourneyInviteRequest } from "models/IWeeklyTourneyInviteRequest";
import { IWeeklyTourneyAcceptDeclineInvite } from "models/IWeeklyTourneyAcceptDeclineInvite";

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

export const weeklyTourneyInvite = createAsyncThunk('weeklyTourney/weeklyTourneyInvite', async (payload: IWeeklyTourneyInviteRequest, thunkApi) => {
    try {
        const response = await WeeklyTourneyService.weeklyTourneyInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})

export const weeklyTourneyAcceptDeclineInvite = createAsyncThunk('weeklyTourney/weeklyTourneyAcceptDeclineInvite', async (payload: IWeeklyTourneyAcceptDeclineInvite, thunkApi) => {
    try {
        const response = await WeeklyTourneyService.weeklyTourneyAcceptDeclineInvite(payload);

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})