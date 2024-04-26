import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IPlayerResponse } from "models/IPlayerResponse";
import { ISeasonGameResponse } from "models/ISeasonGameResponse";
import { ISeasonResponse } from "models/ISeasonResponse";
import { ISeasonStatsResponse } from "models/ISeasonStatsResponse";
import { RootState } from "stores"

export interface ISeasonState {
    seasons: ISeasonResponse[];
    currentSeason: string | null;
    currentSeasonStats: ISeasonStatsResponse[];
    currentSeasonGames: ISeasonGameResponse[];

    currentPlayerData: IPlayerResponse | null;
}

const initialState: ISeasonState = {
    seasons: [],
    currentSeason: null,
    currentSeasonStats: [],
    currentSeasonGames: [],

    currentPlayerData: null
}

export const seasonSlicer = createSlice({
    name: 'season',
    initialState,
    reducers: {
        setSeasons: (state: ISeasonState, action: PayloadAction<ISeasonResponse[]>) => {
            state.seasons = action.payload;
            state.currentSeason = state.seasons[0].id
        },
        setCurrentSeason: (state: ISeasonState, action: PayloadAction<string>) => {
            state.currentSeason = action.payload;
        },
        setCurrentSeasonStats: (state: ISeasonState, action: PayloadAction<ISeasonStatsResponse[]>) => {
            state.currentSeasonStats = action.payload;
        },
        setCurrentSeasonGames: (state: ISeasonState, action: PayloadAction<ISeasonGameResponse[]>) => {
            state.currentSeasonGames = action.payload;
        },
        setCurrentPlayerData: (state: ISeasonState, action: PayloadAction<IPlayerResponse | null>) => {
            state.currentPlayerData = action.payload;
        },
    },
})

export const {
    setSeasons,
    setCurrentSeason,
    setCurrentSeasonStats,
    setCurrentSeasonGames,
    setCurrentPlayerData
} =
    seasonSlicer.actions


export const selectSeasons = (state: RootState) => state.season.seasons;
export const selectCurrentSeason = (state: RootState) => state.season.currentSeason;
export const selectCurrentSeasonStats = (state: RootState) => state.season.currentSeasonStats;
export const selectCurrentSeasonGames = (state: RootState) => state.season.currentSeasonGames;
export const selectCurrentPlayerData = (state: RootState) => state.season.currentPlayerData;

export default seasonSlicer.reducer
