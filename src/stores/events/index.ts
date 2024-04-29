import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ICurrentEventResponse } from "models/ICurrentEventResponse";
import { RootState } from "stores"

export interface IEventsState {
    currentEvent: ICurrentEventResponse | undefined;
}

const initialState: IEventsState = {
    currentEvent: undefined,
}

export const eventsSlicer = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setCurrentEvent: (state: IEventsState, action: PayloadAction<ICurrentEventResponse | undefined>) => {
            state.currentEvent = action.payload;
        },
    },
})

export const {
    setCurrentEvent,
} =
    eventsSlicer.actions


export const selectCurrentEvent = (state: RootState) => state.events.currentEvent;

export default eventsSlicer.reducer
