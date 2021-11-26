import React from 'react';
import {useAppSelector} from "../store/hooks";
import {Box} from "@mui/material";
import {ICard} from "../store/deck/types";
import UpturnedStockCard from "./UpturnedStockCard";
import {getShortName} from "../store/deck/utils";

const UpturnedStock: React.FC = () => {
    const upturnedCards = useAppSelector(state => state.deck.present.stock.upturned);

    const lastTwoCards: Array<ICard | null> = Array(2)
        .fill(null)
        .concat(upturnedCards.slice(-2))
        .slice(-2);

    return (
        <Box sx={{display: 'grid'}}>
            {lastTwoCards.map((card, i) =>
                <UpturnedStockCard card={card} key={card !== null ? getShortName(card) : i}/>
            )}
        </Box>
    );
};

export default UpturnedStock;