import React from 'react';
import {FoundationPlace, StockPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {useDrag} from "react-dnd";
import {moveCards} from "../store/deck/deckSlice";
import {useAppDispatch} from "../store/hooks";

type Props = {
    card: ICard | null;
};

const styles = {
    gridColumn: '1/1',
    gridRow: '1/1',
}

const UpturnedStockCard: React.FC<Props> = ({card}) => {
    const dispatch = useAppDispatch();

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'CARD',
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
            const to: FoundationPlace = {
                type: 'foundation',
                index: foundationIndex as FoundationPlace['index'],
            };
            dispatch(moveCards({cards: [card as ICard], from, to}));
        }
    };

    if (card === null) {
        return (
            <Box sx={styles} className="empty-space empty-space--with-border"/>
        );
    }

    if (isDragging) {
        return null;
    }

    return (
        <Box onDoubleClick={handleDoubleClick} ref={drag} sx={styles}>
            <Card card={card}/>
        </Box>
    );
};

export default UpturnedStockCard;