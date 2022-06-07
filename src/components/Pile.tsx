import React from 'react';
import {Box} from "@mui/material";
import {ICard, PilePlace} from "../store/deck/types";
import PileBox from "./PileBox";
import {useDrop} from "react-dnd";
import {canMoveToPile} from "../store/deck/gameRules";

type Props = {
    cards: ICard[];
    index: PilePlace['index'];
};

const Pile: React.FC<Props> = ({cards, index}) => {
    const [, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item): PilePlace => ({
            type: 'pile',
            index,
        }),
        canDrop: (item: ICard[]) => canMoveToPile(item, cards),
    }), [cards]);

    return (
        <Box ref={drop}>
            {cards.length > 0
                ? <PileBox cards={cards} pileIndex={index}/>
                : <Box className='empty-space'/>
            }
        </Box>
    );
};

export default React.memo(Pile);