import React from 'react';
import {Box} from "@mui/material";
import {ICard, PilePlace} from "../store/deck/types";
import PileBox from "./PileBox";
import {useDrop} from "../hooks/dragndrop";

type Props = {
    cards: ICard[];
    index: PilePlace['index'];
};

const Pile: React.FC<Props> = ({cards, index}) => {
    const {droppableProps} = useDrop(`pile-${index}`);

    return (
        <Box {...droppableProps}>
            {cards.length > 0
                ? <PileBox cards={cards} pileIndex={index}/>
                : <Box className='empty-space'/>
            }
        </Box>
    );
};

export default React.memo(Pile);