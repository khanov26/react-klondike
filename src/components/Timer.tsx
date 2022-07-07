import React, {useEffect} from 'react';
import {Typography, useMediaQuery} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {formatTime} from "../store/game/time";
import {incrementTime} from "../store/game/gameSlice";
import {mobileQuery} from "../mediaQueries";

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

    const isMobile = useMediaQuery(mobileQuery);
    let fontSize;
    if (!isMobile) {
        fontSize = '1.5rem';
    } else {
        fontSize = '1rem';
    }

    return (
        <Typography component="span" sx={{color: 'white', fontSize}}>
            {formatTime(time)}
        </Typography>
    );
};

export default Timer;
