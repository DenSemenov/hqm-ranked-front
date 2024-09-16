import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import season from "./season";
import { loadState } from "./save-load";
import server from "./server";
import admin from "./admin";
import events from "./events";
import teams from "./teams";
import contract from "./contract";
import shop from "./shop";
import weeklyTourney from "./weekly-tourney";

export const store = configureStore({
    reducer: {
        auth,
        season,
        server,
        admin,
        events,
        teams,
        contract,
        shop,
        weeklyTourney
    },
    preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch