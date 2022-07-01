import React from 'react';
import {Grid} from '@mui/material';
import {useAppSelector} from "../store/hooks";
import Foundation from "./Foundation";

const Foundations: React.FC = () => {
    const foundations = useAppSelector(state => state.deck.present.foundations);

    return (
        <Grid container spacing={'1.75%'} columns={4}>
            {foundations.map((foundation, index) =>
                <Grid item xs={1} key={index}>
                    <Foundation cards={foundation} index={index}/>
                </Grid>
            )}
        </Grid>
    );
};

export default React.memo(Foundations);