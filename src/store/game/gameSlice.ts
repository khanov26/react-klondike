import {createSlice, AnyAction, PayloadAction} from "@reduxjs/toolkit";

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
        incrementTime: (state, action: PayloadAction<number>) => {
            state.time = state.time + action.payload;
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
