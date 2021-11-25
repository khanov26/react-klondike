import React from 'react';
import {Button, Stack} from "@mui/material";
import {useAppDispatch} from "../store/hooks";
import {start, restart} from '../store/deck/deckSlice';

const Controls: React.FC = () => {
    const dispatch = useAppDispatch();

    return (
        <Stack direction="row" spacing={3}>
            <Button variant="contained" onClick={() => dispatch(start())}>Новая игра</Button>
            <Button variant="contained" onClick={() => dispatch(restart())}>Попробовать снова</Button>
        </Stack>
    );
};

export default Controls;