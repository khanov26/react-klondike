import {createSlice, AnyAction, PayloadAction} from "@reduxjs/toolkit";

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
    isStatisticsOpen: false,
    playedGamesCount: 0,
    wonGamesCount: 0,
    bestTime: 0,
}, loadPreferencesFromStorage(), loadStatisticsFromStorage());

const startGame = (state: typeof initialState) => {
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
        start: state => {
            startGame(state);
            state.playedGamesCount++;
            saveStatisticsToStorage(state);
        },
        restart: state => {
            startGame(state);
        },
        gameOver: state => {
            state.isOver = true;
            state.finishTime = state.time;
            state.wonGamesCount++;
            if (state.timeControl && (state.finishTime < state.bestTime || state.bestTime === 0)) {
                state.bestTime = state.finishTime;
            }
            saveStatisticsToStorage(state);
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
            savePreferencesToStorage(state);
        },
        toggleAutoMove: state => {
            state.autoMove = !state.autoMove;
            savePreferencesToStorage(state);
        },
        toggleAutoOpen: state => {
            state.autoOpen = !state.autoOpen;
            savePreferencesToStorage(state);
        },
        toggleUndoAvailable: state => {
            state.undoAvailable = !state.undoAvailable;
            savePreferencesToStorage(state);
        },
        openStatistics: state => {
            state.isStatisticsOpen = true;
        },
        closeStatistics: state => {
            state.isStatisticsOpen = false;
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
    openStatistics,
    closeStatistics,
} = gameSlice.actions;

function savePreferencesToStorage(state: typeof initialState) {
    const preferences = {
        timeControl: state.timeControl,
        autoMove: state.autoMove,
        autoOpen: state.autoOpen,
        undoAvailable: state.undoAvailable,
    };
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

function loadPreferencesFromStorage() {
    return JSON.parse(localStorage.getItem('preferences') || '{}');
}

function saveStatisticsToStorage(state: typeof initialState) {
    const statistics = {
        playedGamesCount: state.playedGamesCount,
        wonGamesCount: state.wonGamesCount,
        bestTime: state.bestTime,
    };
    localStorage.setItem('statistics', JSON.stringify(statistics));
}

function loadStatisticsFromStorage() {
    return JSON.parse(localStorage.getItem('statistics') || '{}');
}
