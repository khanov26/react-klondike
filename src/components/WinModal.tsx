import React from 'react';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {Box, Button, Paper, Typography} from '@mui/material';
import {start} from '../store/deck/deckSlice';
import {ActionCreators} from 'redux-undo';

const WinModal: React.FC = () => {
    const win = useAppSelector(state => state.deck.present.win);
    const dispatch = useAppDispatch();

    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
    };

    if (!win) {
        return null;
    }

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, .75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
            }}>
                <Typography variant="h3">
                    Поздравляю! Вы выиграли!
                </Typography>

                <Button variant="contained" sx={{mt: 2}} onClick={handleNewGameButtonClick}>
                    Начать новую игру
                </Button>
            </Paper>
        </Box>
    );
};

export default WinModal;