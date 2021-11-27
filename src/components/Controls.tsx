import React from 'react';
import {Button, Stack} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {start, restart} from '../store/deck/deckSlice';
import {ActionCreators} from 'redux-undo';

const Controls: React.FC = () => {
    const dispatch = useAppDispatch();

    const canUndo = useAppSelector(state => state.deck.past.length > 0);
    const canRedo = useAppSelector(state => state.deck.future.length > 0);

    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
    };

    const handleTryAgainButtonClick = () => {
        dispatch(restart());
        dispatch(ActionCreators.clearHistory());
    };

    return (
        <Stack direction="row" spacing={3}>
            <Button variant="contained" onClick={handleNewGameButtonClick}>Новая игра</Button>
            <Button variant="contained" onClick={handleTryAgainButtonClick}>Попробовать снова</Button>
            <Button variant="contained" disabled={!canUndo}
                    onClick={() => dispatch(ActionCreators.undo())}>
                Отменить ход
            </Button>
            <Button variant="contained" disabled={!canRedo}
                    onClick={() => dispatch(ActionCreators.redo())}>
                Повторить ход
            </Button>
        </Stack>
    );
};

export default Controls;