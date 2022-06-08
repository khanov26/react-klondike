import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {Box, Button, Paper, Typography} from '@mui/material';
import {start, gameOver} from '../store/game/gameSlice';
import {ActionCreators} from 'redux-undo';
import {isGameOver} from "../store/deck/gameRules";
import {formatTime} from "../store/game/time";

const WinModal: React.FC = () => {
    const isOver = useAppSelector(state => state.game.isOver);
    const foundations = useAppSelector(state => state.deck.present.foundations);
    const time = useAppSelector(state => state.game.time);
    const dispatch = useAppDispatch();

    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
    };

    useEffect(() => {
       if (isGameOver(foundations)) {
           dispatch(gameOver());
       }
    }, [foundations, dispatch]);

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, .75)',
            display: isOver ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
            }}>
                <Typography variant="h3">
                    Поздравляю! Вы выиграли!
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