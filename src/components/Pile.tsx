import React, {useCallback, useEffect} from 'react';
import {Box} from "@mui/material";
import {ICard} from "../store/deck/types";
import PileBox from "./PileBox";
import useDrop from "../hooks/dragndrop/useDrop";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { turnCard } from '../store/deck/deckSlice';

type Props = {
    cards: ICard[];
    index: number;
    onMoveToFoundations: (pileIndex: number, pile: ICard[]) => void;
};

const Pile: React.FC<Props> = ({cards, index, onMoveToFoundations}) => {
    const {droppableProps} = useDrop(`pile-${index}`);

    const dispatch = useAppDispatch();

    const handleDoubleClick = (event: React.MouseEvent) => {
        if (cards.length !== 0) {
            event.stopPropagation();
            onMoveToFoundations(index, cards);
        }
    };

    const handleTurnCard = useCallback(() => {
        if (cards.length === 0) {
            return;
        }

        const card = cards[cards.length - 1];
        if (card.isUpturned) {
            return;
        }

        dispatch(turnCard(index));
    }, [cards, index, dispatch]);

    const autoOpen = useAppSelector(state => state.game.autoOpen);
    useEffect(() => {        
        if (autoOpen) {
            handleTurnCard();
        }
    }, [autoOpen, handleTurnCard]);

    return (
        <Box {...droppableProps} onDoubleClick={handleDoubleClick} onClick={handleTurnCard}>
            {cards.length > 0
                ? <PileBox cards={cards} pileIndex={index}/>
                : <Box className='empty-space'/>
            }
        </Box>
    );
};

export default React.memo(Pile);