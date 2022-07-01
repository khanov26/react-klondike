import React from 'react';
import {Box} from "@mui/material";
import {ICard} from "../store/deck/types";
import FoundationCard from "./FoundationCard";
import {getShortName} from "../store/deck/utils";
import useDrop from "../hooks/dragndrop/useDrop";

type Props = {
    cards: ICard[];
    index:  number;
};

const Foundation: React.FC<Props> = ({cards, index}) => {
    const {droppableProps} = useDrop(`foundation-${index}`);

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const lastTwoCards: Array<ICard | null> = Array(2)
        .fill(null)
        .concat(cards.slice(-2))
        .slice(-2);

    return (
        <Box {...droppableProps} sx={{display: 'grid'}} onDoubleClick={handleDoubleClick}>
            {lastTwoCards.map((card, i) =>
                <FoundationCard card={card} foundationIndex={index} key={card !== null ? getShortName(card) : i}/>
            )}
        </Box>
    );

};

export default React.memo(Foundation);