import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IWeeklyTourneyItemResponse } from "models/IWeeklyTourneyItemResponse";
import { IWeelkyTourneyResponse, WeeklyTourneyState } from "models/IWeelkyTourneyResponse";
import { RootState } from "stores"

export interface IWeeklyTourneyState {
    weeklyTourney: IWeelkyTourneyResponse;
    currentWeeklyTourneyId: string | undefined,
    weeklyTourneys: IWeeklyTourneyItemResponse[]
}

const initialState: IWeeklyTourneyState = {
    weeklyTourney: {
        state: WeeklyTourneyState.Canceled,
    },
    currentWeeklyTourneyId: undefined,
    weeklyTourneys: []
}

export const weeklyTourneySlicer = createSlice({
    name: 'weeklyTourney',
    initialState,
    reducers: {
        setWeeklyTourney: (state: IWeeklyTourneyState, action: PayloadAction<IWeelkyTourneyResponse>) => {
            state.weeklyTourney = action.payload;
        },
        setCurrentWeeklyTourney: (state: IWeeklyTourneyState, action: PayloadAction<string | undefined>) => {
            state.currentWeeklyTourneyId = action.payload;
        },
        setWeeklyTourneys: (state: IWeeklyTourneyState, action: PayloadAction<IWeeklyTourneyItemResponse[]>) => {
            state.weeklyTourneys = action.payload;
        },
    },
})

export const {
    setWeeklyTourney,
    setCurrentWeeklyTourney,
    setWeeklyTourneys
} =
    weeklyTourneySlicer.actions


export const selectWeeklyTourney = (state: RootState) => state.weeklyTourney.weeklyTourney;
export const selectCurrentWeeklyTourney = (state: RootState) => state.weeklyTourney.currentWeeklyTourneyId;
export const selectWeeklyTourneys = (state: RootState) => state.weeklyTourney.weeklyTourneys;

export default weeklyTourneySlicer.reducer
