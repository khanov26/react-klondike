import React from 'react';
import {useAppSelector} from "../store/hooks";
import {Box} from "@mui/material";
import {ICard} from "../store/deck/types";
import UpturnedStockCard from "./UpturnedStockCard";
import {getShortName} from "../store/deck/utils";

interface Props {
    onMoveToFoundations: (stock: ICard[]) => void;
}

const UpturnedStock: React.FC<Props> = ({onMoveToFoundations}) => {
    const upturnedCards = useAppSelector(state => state.deck.present.stock.upturned);

    const lastTwoCards: Array<ICard | null> = Array(2)
        .fill(null)
        .concat(upturnedCards.slice(-2))
        .slice(-2);

    const handleDoubleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onMoveToFoundations(upturnedCards);
    };

    return (
        <Box sx={{display: 'grid'}} onDoubleClick={handleDoubleClick}>
            {lastTwoCards.map((card, i) =>
                <UpturnedStockCard card={card} key={card !== null ? getShortName(card) : i}/>
            )}
        </Box>
    );
};

export default UpturnedStock;