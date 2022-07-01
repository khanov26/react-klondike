import React from 'react';
import {ICard} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import useDrag from "../hooks/dragndrop/useDrag";

type Props = {
    card: ICard | null;
};

const styles = {
    gridColumn: '1/1',
    gridRow: '1/1',
}

const UpturnedStockCard: React.FC<Props> = ({card}) => {
    const canDrag = card !== null && card.isUpturned;
    const dragRef = useDrag({canDrag, sourceId: 'stock', data: [card]});

    if (card === null) {
        return (
            <Box sx={styles} className="empty-space empty-space--with-border"/>
        );
    }

    return (
        <Box ref={dragRef} sx={styles}>
            <Card card={card}/>
        </Box>
    );
};

export default React.memo(UpturnedStockCard);