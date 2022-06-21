import React, {useCallback} from 'react';
import {FoundationPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {moveCards, turnCard} from '../store/deck/deckSlice';
import {canMoveToFoundation, canMoveToPile} from "../store/deck/gameRules";
import {useDrag} from "../hooks/dragndrop";

type Props = {
    cards: ICard[];
    pileIndex: PilePlace['index'];
}

const PileBox: React.FC<Props> = ({cards, pileIndex}) => {
    const card = cards[0];
    const nextLevelCards = cards.slice(1);

    const foundations = useAppSelector(state => state.deck.present.foundations);
    const piles = useAppSelector(state => state.deck.present.piles);

    const dispatch = useAppDispatch();

    const handleDrag = useCallback((destinationId: string) => {
        const destination = destinationId.split('-');
        const destinationType = destination[0];
        const destinationIndex = Number(destination[1]);
        let to: PilePlace | FoundationPlace | undefined;
        switch (destinationType) {
            case 'pile':
                if (canMoveToPile(cards, piles[destinationIndex])) {
                    to = {
                        type: 'pile',
                        index: destinationIndex as PilePlace['index'],
                    };
                }
                break;
            case 'foundation':
                if (canMoveToFoundation(cards, foundations[destinationIndex])) {
                    to = {
                        type: 'foundation',
                        index: destinationIndex as FoundationPlace['index'],
                    };
                }
                break;
        }
        if (to === undefined) {
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
    }, [cards, dispatch, foundations, pileIndex, piles]);

    const canDrag = card.isUpturned;

    const dragRef = useDrag(canDrag, handleDrag);

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();

        if (cards.length > 1) {
            return;
        }

        const from: PilePlace = {
            type: 'pile',
            index: pileIndex,
        };

        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveToFoundation(cards, foundations[foundationIndex])) {
                const to: FoundationPlace = {
                    type: 'foundation',
                    index: foundationIndex as FoundationPlace['index'],
                };
                dispatch(moveCards({cards, from, to}));

                break;
            }
        }
    };

    const handleClick = () => {
        if (cards.length > 1) {
            return;
        }

        const card = cards[0];
        if (card.isUpturned) {
            return;
        }

        dispatch(turnCard(pileIndex));
    };

    return (
        <Box ref={dragRef} sx={{
            display: 'grid',
        }}>
            <Box onDoubleClick={handleDoubleClick} onClick={handleClick} sx={{
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