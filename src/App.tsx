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
        <Box className="game-container">
            <Box className="play-zone">
                <Box sx={{mb: 2}}>
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
            </Box>
        </Box>
    );
}

export default App;
