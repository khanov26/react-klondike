import {configureStore} from "@reduxjs/toolkit";
import deckReducer from "./deck/deckSlice";
import gameReducer from "./game/gameSlice";
import undoable, { includeAction } from 'redux-undo';

const store = configureStore({
    reducer: {
        deck: undoable(deckReducer, {
            limit: 10, 
            filter: includeAction(['deck/openNextCard', 'deck/turnStock', 'deck/moveCards']),
        }),
        game: gameReducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;