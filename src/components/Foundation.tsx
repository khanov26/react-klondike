import React from 'react';
import {Box} from "@mui/material";
import {FoundationPlace, ICard} from "../store/deck/types";
import {useDrop} from "react-dnd";
import FoundationCard from "./FoundationCard";
import {getShortName} from "../store/deck/utils";

type Props = {
    cards: ICard[];
    index:  FoundationPlace['index'];
};

const Foundation: React.FC<Props> = ({cards, index}) => {
    const [, drop] = useDrop(() => ({
        accept: 'CARD',
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
        drop: (item): FoundationPlace => ({
            type: 'foundation',
            index
        }),
    }));

    const lastTwoCards: Array<ICard | null> = Array(2)
        .fill(null)
        .concat(cards.slice(-2))
        .slice(-2);

    return (
        <Box ref={drop} sx={{display: 'grid'}}>
            {lastTwoCards.map((card, i) =>
                <FoundationCard card={card} foundationIndex={index} key={card !== null ? getShortName(card) : i}/>
            )}
        </Box>
    );

};

export default Foundation;