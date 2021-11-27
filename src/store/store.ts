import {configureStore} from "@reduxjs/toolkit";
import deckReducer from "./deck/deckSlice";
import undoable from 'redux-undo';

const store = configureStore({
    reducer: {
        deck: undoable(deckReducer),
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;