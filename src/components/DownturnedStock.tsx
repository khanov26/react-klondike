import React from 'react';
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import Card from "./Card";
import {openNextCard} from '../store/deck/deckSlice';

const DownturnedStock: React.FC = () => {
    const dispatch = useAppDispatch();
    const downturnedCards = useAppSelector(state => state.deck.stock.downturned);

    const handleClick = () => {
        dispatch(openNextCard());
    };

    if (downturnedCards.length !== 0) {
        const card = downturnedCards[downturnedCards.length - 1];
        return (
            <Box onClick={handleClick}>
                <Card card={card}/>
            </Box>
        );
    }

    return (
        <Box onClick={handleClick} className="empty-space empty-space--with-border"/>
    );
};

export default DownturnedStock;