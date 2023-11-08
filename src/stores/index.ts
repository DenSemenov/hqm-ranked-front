import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import season from "./season";
import { loadState } from "./save-load";
import server from "./server";

export const store = configureStore({
    reducer: {
        auth,
        season,
        server
    },
    preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch