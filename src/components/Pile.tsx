import React from 'react';
import {Box} from "@mui/material";
import {ICard, PilePlace} from "../store/deck/types";
import PileBox from "./PileBox";
import {useDrop} from "react-dnd";
import {useAppDispatch} from "../store/hooks";
import {turnCard} from '../store/deck/deckSlice';

type Props = {
    cards: ICard[];
    index: PilePlace['index'];
};

const Pile: React.FC<Props> = ({cards, index}) => {
    const dispatch = useAppDispatch();

    const [, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item): PilePlace => ({
            type: 'pile',
            index,
        }),
    }));

    return (
        <Box ref={drop} onClick={() => dispatch(turnCard(index))}>
            {cards.length > 0
                ? <PileBox cards={cards} pileIndex={index}/>
                : <Box className='empty-space'></Box>
            }
        </Box>
    );
};

export default Pile;