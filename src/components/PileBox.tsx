import React from 'react';
import {FoundationPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {useDrag} from "react-dnd";
import {useAppDispatch} from "../store/hooks";
import {moveCards} from '../store/deck/deckSlice';

type Props = {
    cards: ICard[];
    pileIndex: PilePlace['index'];
}

const PileBox: React.FC<Props> = ({cards, pileIndex}) => {
    const card = cards[0];
    const nextLevelCards = cards.slice(1);

    const dispatch = useAppDispatch();

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'CARD',
        canDrag: monitor => card.isUpturned,
        collect: monitor => ({
           isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const to = monitor.getDropResult();
            if (to === null) {
                return;
            }

            const payload: MoveCardsPayload = {
                cards,
                from: {
                    type: 'pile',
                    index: pileIndex,
                },
                to: to as PilePlace | FoundationPlace,
            };
            dispatch(moveCards(payload));
        },
    }), [cards]);

    const handleDoubleClick = () => {
        if (cards.length > 1) {
            return;
        }

        const from: PilePlace = {
            type: 'pile',
            index: pileIndex,
        };

        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            const to: FoundationPlace = {
                type: 'foundation',
                index: foundationIndex as FoundationPlace['index'],
            };
            dispatch(moveCards({cards, from, to}));
        }
    };

    if (isDragging) {
        return null;
    }

    return (
        <Box ref={drag} sx={{
            display: 'grid',
        }}>
            <Box onDoubleClick={handleDoubleClick} sx={{
                gridColumn: '1/1',
                gridRow: '1/1',
            }}>
                <Card card={card}/>
            </Box>
            {nextLevelCards.length > 0 &&
            <Box sx={{
                gridColumn: '1/1',
                gridRow: '1/1',
                mt: card.isUpturned ? '25%' : '15%',
            }}>
                <PileBox cards={nextLevelCards} pileIndex={pileIndex}/>
            </Box>
            }
        </Box>
    );
};

export default PileBox;