import React, {useEffect, useRef} from 'react';
import {Grid, Box, useMediaQuery, Stack} from '@mui/material';
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
import {isDesktopQuery, isLandscapeQuery} from "./mediaQueries";
import {TouchBackend} from "react-dnd-touch-backend";

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

    const isTouchDevice = useMediaQuery('(pointer: coarse)');

    const isDesktop = useMediaQuery(isDesktopQuery);
    const isLandscape = useMediaQuery(isLandscapeQuery);

    return (
        <Box className="game-container" onDoubleClick={handleDoubleClick} sx={{
            height: '100%',
            p: '12px',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Stack
                spacing={2}
                direction={isDesktop || !isLandscape ? 'column' : 'row'}
                sx={{
                    maxWidth: 'min(1200px, 100%)',
                    maxHeight: 'calc(100vh - 24px)',
                    aspectRatio: isDesktop || !isLandscape ? '100 / 95' : '115 / 95',
                }}
            >
                <Stack
                    direction={isDesktop || !isLandscape ? 'row' : 'column'}
                    justifyContent="space-between"
                >
                    <Controls/>
                    <Timer/>
                </Stack>

                <Box>
                    <Grid container columns={7} spacing={'1%'}>
                        {isTouchDevice &&
                        <DndProvider backend={TouchBackend}>
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
                        }

                        {!isTouchDevice &&
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
                        }
                    </Grid>
                </Box>
            </Stack>

            <WinModal/>
        </Box>
    );
}

export default App;
