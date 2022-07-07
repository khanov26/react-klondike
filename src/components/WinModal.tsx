import React, { useState } from 'react';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {Button, Stack, Typography} from '@mui/material';
import {start} from '../store/game/gameSlice';
import {ActionCreators} from 'redux-undo';
import {formatTime} from "../store/game/time";
import BaseModal from './BaseModal';

const WinModal: React.FC = () => {
    const isOver = useAppSelector(state => state.game.isOver);
    const time = useAppSelector(state => state.game.finishTime);
    const bestTime = useAppSelector(state => state.game.bestTime);
    const dispatch = useAppDispatch();

    const [closed, setClosed] = useState(false);
    const handleClose = () => {
        setClosed(true);
    };

    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
    };

    const modalContent = (
        <Stack direction="column" alignItems="center">
            <Typography variant="h3" sx={{
                fontSize: {xs: '1.5rem', sm: '2rem', md: '3rem'},
            }}>
                Поздравляю! Вы&nbsp;выиграли!
            </Typography>

            {time > 0 &&
            <Typography sx={{mt: 2}}>
                Ваше время: {formatTime(time)}
            </Typography>
            }

            {time > 0 && bestTime > 0 &&
                <Typography sx={{ mt: 2 }}>
                    Личный рекорд: {formatTime(bestTime)}
                </Typography>
            }

            <Button variant="contained" sx={{mt: 2}} onClick={handleNewGameButtonClick}>
                Начать новую игру
            </Button>
        </Stack>
    );

    return (
        <BaseModal
            open={!closed && isOver}
            onClose={handleClose}
            content={modalContent}
        />
    );
};

export default React.memo(WinModal);