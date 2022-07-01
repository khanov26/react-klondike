import React from 'react';
import {Grid} from '@mui/material';
import DownturnedStock from "./DownturnedStock";
import UpturnedStock from "./UpturnedStock";
import { ICard } from '../store/deck/types';

interface Props {
    onMoveToFoundations: (stock: ICard[]) => void;
}

const Stock: React.FC<Props> = ({onMoveToFoundations}) => {
    return (
        <Grid container spacing={'2.3%'} columns={3}>
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
