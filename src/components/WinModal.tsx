import React from 'react';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {Box, Button, Paper, Typography} from '@mui/material';
import {start} from '../store/game/gameSlice';
import {ActionCreators} from 'redux-undo';
import {formatTime} from "../store/game/time";

const WinModal: React.FC = () => {
    const isOver = useAppSelector(state => state.game.isOver);
    const time = useAppSelector(state => state.game.finishTime);
    const dispatch = useAppDispatch();

    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
    };

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, .5)',
            display: isOver ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
        }}>
            <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
            }}>
                <Typography variant="h3" sx={{
                    fontSize: {xs: '1.5rem', sm: '2rem', md: '3rem'},
                    textAlign: 'center',
                }}>
                    Поздравляю! Вы&nbsp;выиграли!
                </Typography>

                {time > 0 &&
                <Typography sx={{mt: 2}}>
                    Ваше время: {formatTime(time)}
                </Typography>
                }

                <Button variant="contained" sx={{mt: 2}} onClick={handleNewGameButtonClick}>
                    Начать новую игру
                </Button>
            </Paper>
        </Box>
    );
};

export default React.memo(WinModal);