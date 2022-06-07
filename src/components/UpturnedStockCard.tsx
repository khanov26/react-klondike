import React from 'react';
import {FoundationPlace, StockPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {useDrag} from "react-dnd";
import {moveCards} from "../store/deck/deckSlice";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {canMoveToFoundation} from "../store/deck/gameRules";

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

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'CARD',
        item: [card],
        canDrag: monitor => card !== null,
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const to = monitor.getDropResult();
            if (to === null) {
                return;
            }

            const payload: MoveCardsPayload = {
                cards: [card as ICard],
                from: {
                    type: 'stock',
                },
                to: to as PilePlace | FoundationPlace,
            };
            dispatch(moveCards(payload));
        },
    }), [card]);

    const handleDoubleClick = () => {
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
        <Box onDoubleClick={handleDoubleClick} ref={drag} sx={{...styles, visibility: isDragging ? 'hidden': 'visible'}}>
            <Card card={card}/>
        </Box>
    );
};

export default UpturnedStockCard;