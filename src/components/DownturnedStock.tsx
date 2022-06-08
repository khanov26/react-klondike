import React from 'react';
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import Card from "./Card";
import {openNextCard, turnStock} from '../store/deck/deckSlice';

const DownturnedStock: React.FC = () => {
    const dispatch = useAppDispatch();
    const downturnedCards = useAppSelector(state => state.deck.present.stock.downturned);
    const upturnedCards = useAppSelector(state => state.deck.present.stock.upturned);

    const handleStockClick = () => {
        dispatch(openNextCard());
    };

    const handleEmptyStockClick = () => {
        if (upturnedCards.length > 0) {
            dispatch(turnStock());
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