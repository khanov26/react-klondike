import {createSlice, AnyAction} from "@reduxjs/toolkit";

const initialState = {
    isOver: false,
    isNewGame: true,
    time: 0,
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
        },
        incrementTime: state => {
            state.time = state.time + 1;
        }
    },
    extraReducers: builder => {
        builder.addMatcher(isDeckAction, state => {
            state.isNewGame = false;
        });
    }
});

export default gameSlice.reducer;

export const {start, restart, gameOver, incrementTime} = gameSlice.actions;
