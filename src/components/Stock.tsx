import React from 'react';
import {Grid} from '@mui/material';
import DownturnedStock from "./DownturnedStock";
import UpturnedStock from "./UpturnedStock";

const Stock: React.FC = () => {
    return (
        <Grid container spacing={'2.3%'} columns={3}>
            <Grid item xs={1}>
                <DownturnedStock/>
            </Grid>
            <Grid item xs={1}>
                <UpturnedStock/>
            </Grid>
        </Grid>
    );
};

export default React.memo(Stock);
