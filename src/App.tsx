import React from 'react';
import {Container, Grid, Box} from '@mui/material';
import Stock from './components/Stock';
import Foundations from './components/Foundations';
import Piles from './components/Piles';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";
import Controls from "./components/Controls";

function App() {
    return (
        <Container sx={{height: '100%', py: 2}}>
            <Box sx={{my: 2}}>
                <Controls/>
            </Box>
            <Grid container columns={7} spacing={2}>
                <DndProvider backend={HTML5Backend}>
                    <Grid item xs={3}>
                        <Stock/>
                    </Grid>
                    <Grid item xs={4}>
                        <Foundations/>
                    </Grid>
                    <Grid item xs={7}>
                        <Piles/>
                    </Grid>
                </DndProvider>
            </Grid>
        </Container>
    );
}

export default App;
