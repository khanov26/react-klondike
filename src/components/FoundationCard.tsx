import React, {useCallback} from 'react';
import {FoundationPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {moveCards} from '../store/deck/deckSlice';
import {useDrag} from "../hooks/dragndrop";
import {canMoveToFoundation, canMoveToPile} from "../store/deck/gameRules";

type Props = {
    card: ICard | null;
    foundationIndex: FoundationPlace['index'];
};

const styles = {
    gridColumn: '1/1',
    gridRow: '1/1',
};

const FoundationCard: React.FC<Props> = ({card, foundationIndex}) => {
    const dispatch = useAppDispatch();

    const foundations = useAppSelector(state => state.deck.present.foundations);
    const piles = useAppSelector(state => state.deck.present.piles);

    const handleDrag = useCallback((destinationId: string) => {
        if (card === null) {
            return;
        }

        const destination = destinationId.split('-');
        const destinationType = destination[0];
        const destinationIndex = Number(destination[1]);
        let to: PilePlace | FoundationPlace | undefined;
        switch (destinationType) {
            case 'pile':
                if (canMoveToPile([card], piles[destinationIndex])) {
                    to = {
                        type: 'pile',
                        index: destinationIndex as PilePlace['index'],
                    };
                }
                break;
            case 'foundation':
                if (canMoveToFoundation([card], foundations[destinationIndex])) {
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
            cards: [card],
            from: {
                type: 'foundation',
                index: foundationIndex,
            },
            to: to as PilePlace | FoundationPlace,
        };
        dispatch(moveCards(payload));
    }, [card, dispatch, foundationIndex, foundations, piles]);

    const canDrag = card !== null && card.isUpturned;

    const dragRef = useDrag(canDrag, handleDrag);

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    if (card === null) {
        return (
            <Box
                className="empty-space empty-space--with-border"
                style={styles}
                onDoubleClick={handleDoubleClick}
            />
        );
    }

    return (
        <Box ref={dragRef} style={styles} onDoubleClick={handleDoubleClick}>
            <Card card={card}/>
        </Box>
    );
};

export default FoundationCard;