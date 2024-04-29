import { createAsyncThunk } from "@reduxjs/toolkit"
import EventsService from "services/EventsService"
import { setCurrentEvent } from "."

export const getCurrentEvent = createAsyncThunk('season/getCurrentEvent', async (payload: void, thunkApi) => {
    try {
        const response = await EventsService.getCurrentEvent()

        thunkApi.dispatch(setCurrentEvent(response.data))

        return response.data
    } catch (e: any) {
        return thunkApi.rejectWithValue(e)
    }
})