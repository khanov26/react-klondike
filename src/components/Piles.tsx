import React from 'react';
import {Grid} from "@mui/material";
import {useAppSelector} from "../store/hooks";
import Pile from "./Pile";
import {PilePlace} from "../store/deck/types";

const Piles: React.FC = () => {
    const piles = useAppSelector(state => state.deck.present.piles);

    return (
        <Grid container alignItems="flex-start" spacing={2} columns={7}>
            {piles.map((pile, index) => (
                <Grid item key={index} xs={1}>
                    <Pile cards={pile} index={index as PilePlace['index']} />
                </Grid>
            ))}
        </Grid>
    );
};

export default Piles;