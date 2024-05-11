import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import season from "./season";
import { loadState } from "./save-load";
import server from "./server";
import admin from "./admin";
import events from "./events";

export const store = configureStore({
    reducer: {
        auth,
        season,
        server,
        admin,
        events,
    },
    preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch