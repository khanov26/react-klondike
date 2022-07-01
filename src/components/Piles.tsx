import React from 'react';
import {Grid} from "@mui/material";
import {useAppSelector} from "../store/hooks";
import Pile from "./Pile";
import { ICard } from '../store/deck/types';

interface Props {
    onMoveToFoundations: (pileIndex: number, pile: ICard[]) => void;
}

const Piles: React.FC<Props> = ({onMoveToFoundations}) => {
    const piles = useAppSelector(state => state.deck.present.piles);

    return (
        <Grid container alignItems="flex-start" spacing={'1%'} columns={7}>
            {piles.map((pile, index) => (
                <Grid item key={index} xs={1}>
                    <Pile cards={pile} index={index} onMoveToFoundations={onMoveToFoundations} />
                </Grid>
            ))}
        </Grid>
    );
};

export default React.memo(Piles);