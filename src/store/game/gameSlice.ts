import {createSlice, AnyAction} from "@reduxjs/toolkit";

const initialState = {
    isOver: false,
    isNewGame: true,
};

const startGame = () => {
    return initialState;
};

const isDeckAction = (action: AnyAction) => action.type.startsWith('deck/');

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        start: startGame,
        restart: startGame,
        gameOver: state => {
            state.isOver = true;
        }
    },
    extraReducers: builder => {
        builder.addMatcher(isDeckAction, state => {
            state.isNewGame = false;
        });
    }
});

export default gameSlice.reducer;

export const {start, restart, gameOver} = gameSlice.actions;
