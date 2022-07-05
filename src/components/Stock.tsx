import React from 'react';
import {Grid, useMediaQuery} from '@mui/material';
import DownturnedStock from "./DownturnedStock";
import UpturnedStock from "./UpturnedStock";
import { ICard } from '../store/deck/types';
import { mobileQuery } from '../mediaQueries';

interface Props {
    onMoveToFoundations: (stock: ICard[]) => void;
}

const Stock: React.FC<Props> = ({onMoveToFoundations}) => {
    const isMobile = useMediaQuery(mobileQuery);

    return (
        <Grid container spacing={'2.3%'} columns={3} direction={isMobile ? 'row-reverse' : 'row'}>
            <Grid item xs={1}>
                <DownturnedStock/>
            </Grid>
            <Grid item xs={1}>
                <UpturnedStock onMoveToFoundations={onMoveToFoundations}/>
            </Grid>
        </Grid>
    );
};

export default React.memo(Stock);
