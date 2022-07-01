import {createSlice, AnyAction, PayloadAction, CaseReducer} from "@reduxjs/toolkit";

const initialState = Object.assign({
    isOver: false,
    isNewGame: true,
    time: 0,
    finishTime: 0,
    isPreferencesOpen: false,
    timeControl: true,
    autoMove: true,
    autoOpen: false,
    undoAvailable: true,
}, loadFromStorage());

const startGame: CaseReducer<typeof initialState> = (state) => {
    state.isOver = false;
    state.isNewGame = true;
    state.time = 0;
    state.finishTime = 0;
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
            state.finishTime = state.time;
        },
        incrementTime: (state, action: PayloadAction<number>) => {
            state.time = state.time + action.payload;
        },
        openPrefences: state => {
            state.isPreferencesOpen = true;
        },
        closePreferences: state => {
            state.isPreferencesOpen = false;
        },
        toggleTimeControl: state => {
            state.timeControl = !state.timeControl;
            saveToStorage(state);
        },
        toggleAutoMove: state => {
            state.autoMove = !state.autoMove;
            saveToStorage(state);
        },
        toggleAutoOpen: state => {
            state.autoOpen = !state.autoOpen;
            saveToStorage(state);
        },
        toggleUndoAvailable: state => {
            state.undoAvailable = !state.undoAvailable;
            saveToStorage(state);
        },
    },
    extraReducers: builder => {
        builder.addMatcher(isDeckAction, state => {
            state.isNewGame = false;
        });
    }
});

export default gameSlice.reducer;

export const { 
    start, 
    restart, 
    gameOver, 
    incrementTime, 
    openPrefences, 
    closePreferences,
    toggleTimeControl,
    toggleAutoMove,
    toggleAutoOpen,
    toggleUndoAvailable,
} = gameSlice.actions;

function saveToStorage(state: typeof initialState) {
    const preferences = {
        timeControl: state.timeControl,
        autoMove: state.autoMove,
        autoOpen: state.autoOpen,
        undoAvailable: state.undoAvailable,
    };
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

function loadFromStorage() {
    return JSON.parse(localStorage.getItem('preferences') || '{}');
}
