import React from 'react';
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import Card from "./Card";
import {openNextCard, turnStock} from '../store/deck/deckSlice';
import { cardSound, stockSound } from '../sounds';

const DownturnedStock: React.FC = () => {
    const dispatch = useAppDispatch();
    const downturnedCards = useAppSelector(state => state.deck.present.stock.downturned);
    const upturnedCards = useAppSelector(state => state.deck.present.stock.upturned);
    const sounds = useAppSelector(state => state.game.sounds);

    const handleStockClick = () => {
        dispatch(openNextCard());
        if (sounds) {
            cardSound.play();
        }
    };

    const handleEmptyStockClick = () => {
        if (upturnedCards.length > 0) {
            dispatch(turnStock());
            if (sounds) {
                stockSound.play();
            }
        }
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    if (downturnedCards.length !== 0) {
        const card = downturnedCards[downturnedCards.length - 1];
        return (
            <Box onClick={handleStockClick} onDoubleClick={handleDoubleClick}>
                <Card card={card}/>
            </Box>
        );
    }

    return (
        <Box
            onClick={handleEmptyStockClick}
            onDoubleClick={handleDoubleClick}
            className="empty-space empty-space--with-border"
        />
    );
};

export default DownturnedStock;