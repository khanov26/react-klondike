import React, {useEffect, useRef} from 'react';
import {Grid, Box} from '@mui/material';
import Stock from './components/Stock';
import Foundations from './components/Foundations';
import Piles from './components/Piles';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";
import Controls from "./components/Controls";
import WinModal from "./components/WinModal";
import Timer from "./components/Timer";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {canMoveToFoundation} from "./store/deck/gameRules";
import {FoundationPlace, PilePlace, StockPlace} from "./store/deck/types";
import {moveCards} from "./store/deck/deckSlice";
import {incrementTime} from "./store/game/gameSlice";

function App() {
    const {piles, foundations, stock: {upturned}} = useAppSelector(state => state.deck.present);
    const dispatch = useAppDispatch();

    const moved = useRef<boolean>();

    useEffect(() => {
        if (moved.current) {
            autoMove();
        }
    });

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        dispatch(incrementTime(10));
        autoMove();
    };

    const autoMove = () => {
        moved.current = false;

        if (moveFromStock()) {
            moved.current = true;
            return;
        }
        if (moveFromPiles()) {
            moved.current = true;
            return;
        }
    };

    const moveFromStock = () => {
        const upturnedStockLastCard = upturned.length ? upturned[upturned.length - 1] : null;
        if (upturnedStockLastCard === null) {
            return false;
        }

        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveToFoundation([upturnedStockLastCard], foundations[foundationIndex])) {
                const from: StockPlace = {
                    type: 'stock'
                };

                const to: FoundationPlace = {
                    type: 'foundation',
                    index: foundationIndex as FoundationPlace['index'],
                };
                dispatch(moveCards({cards: [upturnedStockLastCard], from, to}));
                return true;
            }
        }
        return false;
    };

    const moveFromPiles = () => {
        let movedFromPiles = false;

        for (let index = 0; index < piles.length; index++) {
            const pile = piles[index];
            const pileLastCard = pile.length ? pile[pile.length - 1] : null;
            if (pileLastCard === null || !pileLastCard.isUpturned) {
                continue;
            }
            for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
                if (canMoveToFoundation([pileLastCard], foundations[foundationIndex])) {
                    const from: PilePlace = {
                        type: 'pile',
                        index: index as PilePlace['index'],
                    };

                    const to: FoundationPlace = {
                        type: 'foundation',
                        index: foundationIndex as FoundationPlace['index'],
                    };
                    dispatch(moveCards({cards: [pileLastCard], from, to}));
                    return true;
                }
            }
        }

        return movedFromPiles;
    };

    return (
        <Box className="game-container" onDoubleClick={handleDoubleClick}>
            <Box className="play-zone">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                }}>
                    <Controls/>
                    <Timer/>
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

            <WinModal/>
        </Box>
    );
}

export default App;
