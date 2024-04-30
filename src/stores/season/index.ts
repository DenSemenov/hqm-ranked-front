import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IGameResponse } from "models/IGameResponse";
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
    currentGameData: IGameResponse | null;
    rules: string;
}

const initialState: ISeasonState = {
    seasons: [],
    currentSeason: null,
    currentSeasonStats: [],
    currentSeasonGames: [],

    currentPlayerData: null,
    currentGameData: null,
    rules: ""
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
            const notIncluded = action.payload.filter(x => state.currentSeasonGames.findIndex(y => y.gameId === x.gameId) === -1);
            state.currentSeasonGames.push(...notIncluded);
        },
        setCurrentPlayerData: (state: ISeasonState, action: PayloadAction<IPlayerResponse | null>) => {
            state.currentPlayerData = action.payload;
        },
        setCurrentGameData: (state: ISeasonState, action: PayloadAction<IGameResponse | null>) => {
            state.currentGameData = action.payload;
        },
        setRules: (state: ISeasonState, action: PayloadAction<string>) => {
            state.rules = action.payload;
        },
    },
})

export const {
    setSeasons,
    setCurrentSeason,
    setCurrentSeasonStats,
    setCurrentSeasonGames,
    setCurrentPlayerData,
    setCurrentGameData,
    setRules
} =
    seasonSlicer.actions


export const selectSeasons = (state: RootState) => state.season.seasons;
export const selectCurrentSeason = (state: RootState) => state.season.currentSeason;
export const selectCurrentSeasonStats = (state: RootState) => state.season.currentSeasonStats;
export const selectCurrentSeasonGames = (state: RootState) => state.season.currentSeasonGames;
export const selectCurrentPlayerData = (state: RootState) => state.season.currentPlayerData;
export const selectCurrentGameData = (state: RootState) => state.season.currentGameData;
export const selectRules = (state: RootState) => state.season.rules;

export default seasonSlicer.reducer
