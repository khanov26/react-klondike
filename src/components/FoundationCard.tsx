import React from 'react';
import {ICard} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import useDrag from "../hooks/dragndrop/useDrag";

type Props = {
    card: ICard | null;
    foundationIndex: number;
};

const styles = {
    gridColumn: '1/1',
    gridRow: '1/1',
};

const FoundationCard: React.FC<Props> = ({card, foundationIndex}) => {
    const canDrag = card !== null && card.isUpturned;
    const dragRef = useDrag({canDrag, sourceId: `foundation-${foundationIndex}`, data: [card]});

    if (card === null) {
        return (
            <Box
                className="empty-space empty-space--with-border"
                style={styles}
            />
        );
    }

    return (
        <Box ref={dragRef} style={styles}>
            <Card card={card}/>
        </Box>
    );
};

export default FoundationCard;