import React, {useCallback} from 'react';
import {FoundationPlace, StockPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {moveCards} from "../store/deck/deckSlice";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {canMoveToFoundation, canMoveToPile} from "../store/deck/gameRules";
import {useDrag} from "../hooks/dragndrop";

type Props = {
    card: ICard | null;
};

const styles = {
    gridColumn: '1/1',
    gridRow: '1/1',
}

const UpturnedStockCard: React.FC<Props> = ({card}) => {
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
            from: {type: 'stock'},
            to: to as PilePlace | FoundationPlace,
        };
        dispatch(moveCards(payload));
    }, [card, dispatch, foundations, piles]);

    const canDrag = card !== null && card.isUpturned;

    const dragRef = useDrag(canDrag, handleDrag);

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();

        const from: StockPlace = {
            type: 'stock',
        };

        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveToFoundation([card as ICard], foundations[foundationIndex])) {
                const to: FoundationPlace = {
                    type: 'foundation',
                    index: foundationIndex as FoundationPlace['index'],
                };
                dispatch(moveCards({cards: [card as ICard], from, to}));

                break;
            }
        }
    };

    if (card === null) {
        return (
            <Box sx={styles} className="empty-space empty-space--with-border"/>
        );
    }

    return (
        <Box ref={dragRef} onDoubleClick={handleDoubleClick} sx={styles}>
            <Card card={card}/>
        </Box>
    );
};

export default UpturnedStockCard;