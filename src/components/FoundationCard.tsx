import React from 'react';
import {FoundationPlace, ICard, MoveCardsPayload, PilePlace} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import {useAppDispatch} from "../store/hooks";
import {useDrag} from "react-dnd";
import {moveCards} from '../store/deck/deckSlice';

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

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'CARD',
        item: [card],
        canDrag: monitor => card !== null,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
            const to = monitor.getDropResult();
            if (to === null) {
                return;
            }

            const payload: MoveCardsPayload = {
                cards: [card as ICard],
                from: {
                    type: 'foundation',
                    index: foundationIndex,
                },
                to: to as PilePlace | FoundationPlace,
            };
            dispatch(moveCards(payload));
        },
    }), [card]);

    if (card === null) {
        return <Box className="empty-space empty-space--with-border" style={styles} />
    }

    return (
        <Box ref={drag} style={styles} sx={{visibility: isDragging ? 'hidden' : 'visible'}}>
            <Card card={card}/>
        </Box>
    );
};

export default FoundationCard;