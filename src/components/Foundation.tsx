import React from 'react';
import {Box} from "@mui/material";
import {FoundationPlace, ICard} from "../store/deck/types";
import FoundationCard from "./FoundationCard";
import {getShortName} from "../store/deck/utils";
import {useDrop} from "../hooks/dragndrop";

type Props = {
    cards: ICard[];
    index:  FoundationPlace['index'];
};

const Foundation: React.FC<Props> = ({cards, index}) => {
    const {droppableProps} = useDrop(`foundation-${index}`);

    const lastTwoCards: Array<ICard | null> = Array(2)
        .fill(null)
        .concat(cards.slice(-2))
        .slice(-2);

    return (
        <Box {...droppableProps} sx={{display: 'grid'}}>
            {lastTwoCards.map((card, i) =>
                <FoundationCard card={card} foundationIndex={index} key={card !== null ? getShortName(card) : i}/>
            )}
        </Box>
    );

};

export default React.memo(Foundation);