import React, {useMemo} from 'react';
import {ICard} from "../store/deck/types";
import {Box} from "@mui/material";
import Card from "./Card";
import useDrag from "../hooks/dragndrop/useDrag";

type Props = {
    cards: ICard[];
    pileIndex: number;
}

const PileBox: React.FC<Props> = ({cards, pileIndex}) => {
    const card = cards[0];
    const nextLevelCards = useMemo(() => cards.slice(1), [cards]);

    const canDrag = card.isUpturned;

    const dragRef = useDrag({canDrag, sourceId: `pile-${pileIndex}`, data: cards});

    return (
        <Box ref={dragRef} sx={{
            display: 'grid',
        }}>
            <Box sx={{
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

export default React.memo(PileBox);