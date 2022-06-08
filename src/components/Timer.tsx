import React, {useEffect} from 'react';
import {Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {formatTime} from "../store/game/time";
import {incrementTime} from "../store/game/gameSlice";

const Timer: React.FC = () => {
    const isGameOver = useAppSelector(state => state.game.isOver);
    const isNewGame = useAppSelector(state => state.game.isNewGame);
    const time = useAppSelector(state => state.game.time);

    const dispatch = useAppDispatch();

    useEffect(() => {
        let timerId: number;
        if (!isGameOver && !isNewGame) {
            timerId = window.setInterval(() => dispatch(incrementTime(1)), 1000);
        }

        return () => window.clearInterval(timerId);
    }, [isGameOver, isNewGame, dispatch]);

    return (
        <Typography variant="h5" sx={{color: 'white'}}>
            {formatTime(time)}
        </Typography>
    );
};

export default Timer;
