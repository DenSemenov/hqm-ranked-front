import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IGameResponse } from "models/IGameResponse";
import { IPlayerResponse } from "models/IPlayerResponse";
import { IRulesResponse } from "models/IRulesResponse";
import { ISeasonGameResponse } from "models/ISeasonGameResponse";
import { ISeasonResponse } from "models/ISeasonResponse";
import { ISeasonStatsResponse } from "models/ISeasonStatsResponse";
import { IStoryResponse } from "models/IStoryResponse";
import { ITopStatsResponse } from "models/ITopStatsResponse";
import { RootState } from "stores"

export interface ISeasonState {
    seasons: ISeasonResponse[];
    currentSeason: string | null;
    currentSeasonStats: ISeasonStatsResponse[];
    currentSeasonGames: ISeasonGameResponse[];

    currentPlayerData: IPlayerResponse | null;
    currentGameData: IGameResponse | null;
    rules: IRulesResponse;

    storageUrl: string;

    stories: IStoryResponse[]
    loading: boolean;

    topStats: ITopStatsResponse[];
}

const initialState: ISeasonState = {
    seasons: [],
    currentSeason: null,
    currentSeasonStats: [],
    currentSeasonGames: [],

    currentPlayerData: null,
    currentGameData: null,
    rules: {
        text: "",
        rules: []
    },

    storageUrl: "",

    stories: [],

    loading: false,

    topStats: []
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
            if (action.payload) {
                state.loading = false
            } else {
                state.loading = true
            }
        },
        setCurrentGameData: (state: ISeasonState, action: PayloadAction<IGameResponse | null>) => {
            state.currentGameData = action.payload;
            if (action.payload) {
                state.loading = false
            } else {
                state.loading = true
            }
        },
        setRules: (state: ISeasonState, action: PayloadAction<IRulesResponse>) => {
            state.rules = action.payload;
        },
        setStorageUrl: (state: ISeasonState, action: PayloadAction<string>) => {
            state.storageUrl = action.payload;
        },
        setStories: (state: ISeasonState, action: PayloadAction<IStoryResponse[]>) => {
            state.stories = action.payload;
        },
        setTopStats: (state: ISeasonState, action: PayloadAction<ITopStatsResponse[]>) => {
            state.topStats = action.payload;
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
    setRules,
    setStorageUrl,
    setStories,
    setTopStats
} =
    seasonSlicer.actions


export const selectSeasons = (state: RootState) => state.season.seasons;
export const selectCurrentSeason = (state: RootState) => state.season.currentSeason;
export const selectCurrentSeasonStats = (state: RootState) => state.season.currentSeasonStats;
export const selectCurrentSeasonGames = (state: RootState) => state.season.currentSeasonGames;
export const selectCurrentPlayerData = (state: RootState) => state.season.currentPlayerData;
export const selectCurrentGameData = (state: RootState) => state.season.currentGameData;
export const selectRules = (state: RootState) => state.season.rules;
export const selectStorageUrl = (state: RootState) => state.season.storageUrl;
export const selectStories = (state: RootState) => state.season.stories;
export const selectLoading = (state: RootState) => state.season.loading;
export const selectTopStats = (state: RootState) => state.season.topStats;

export default seasonSlicer.reducer
