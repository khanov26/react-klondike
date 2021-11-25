import {configureStore} from "@reduxjs/toolkit";
import deckReducer from "./deck/deckSlice";

const store = configureStore({
    reducer: {
        deck: deckReducer,
    }
});

function logger() {
    console.log(arguments);
}

store.subscribe(logger);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;