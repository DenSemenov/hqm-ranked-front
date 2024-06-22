import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAdminStoryResponse } from "models/IAdminStoryResponse";
import { IGameResponse } from "models/IGameResponse";
import { IInstanceType } from "models/IInstanceType";
import { IPartolResponse } from "models/IPartolResponse";
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
    mainStories: IAdminStoryResponse[]
    loading: boolean;

    topStats: ITopStatsResponse[];

    patrols: IPartolResponse[];

    currentMode: IInstanceType;

    clearImageCache: Date | undefined;
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
    mainStories: [],

    loading: false,

    topStats: [],

    patrols: [],

    currentMode: IInstanceType.Ranked,

    clearImageCache: undefined
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
        setLoading: (state: ISeasonState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setStorageUrl: (state: ISeasonState, action: PayloadAction<string>) => {
            state.storageUrl = action.payload;
        },
        setStories: (state: ISeasonState, action: PayloadAction<IStoryResponse[]>) => {
            state.stories = action.payload;
        },
        setMainStories: (state: ISeasonState, action: PayloadAction<IAdminStoryResponse[]>) => {
            state.mainStories = action.payload;
        },
        setTopStats: (state: ISeasonState, action: PayloadAction<ITopStatsResponse[]>) => {
            state.topStats = action.payload;
        },
        setPatrols: (state: ISeasonState, action: PayloadAction<IPartolResponse[]>) => {
            state.patrols = action.payload;
        },
        setCurrentMode: (state: ISeasonState, action: PayloadAction<IInstanceType>) => {
            state.currentMode = action.payload;
        },
        setClearImageCache: (state: ISeasonState, action: PayloadAction<Date>) => {
            state.clearImageCache = action.payload;
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
    setMainStories,
    setTopStats,
    setPatrols,
    setCurrentMode,
    setClearImageCache,
    setLoading
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
export const selectStories = (state: RootState) => {
    const stories: IStoryResponse[] = []
    state.season.stories.forEach(player => {
        const goals = player.goals.filter(x => x.instanceType === state.season.currentMode)
        if (goals.length !== 0) {
            stories.push({
                playerId: player.playerId,
                name: player.name,
                goals: player.goals.filter(x => x.instanceType === state.season.currentMode)
            })
        }
    })

    return stories;
};
export const selectMainStories = (state: RootState) => state.season.mainStories;
export const selectLoading = (state: RootState) => state.season.loading;
export const selectTopStats = (state: RootState) => state.season.topStats;
export const selectPatrols = (state: RootState) => state.season.patrols;
export const selectCurrentMode = (state: RootState) => state.season.currentMode;
export const selectClearImageCache = (state: RootState) => state.season.clearImageCache;

export default seasonSlicer.reducer
