import React, { useCallback, useEffect, useRef } from 'react';
import { Grid, Box, useMediaQuery, Stack } from '@mui/material';
import Stock from './components/Stock';
import Foundations from './components/Foundations';
import Piles from './components/Piles';
import Controls from "./components/Controls";
import WinModal from "./components/WinModal";
import Timer from "./components/Timer";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { gameOver, incrementTime, start } from "./store/game/gameSlice";
import { desktopQuery, landscapeQuery, mobileQuery } from "./mediaQueries";
import PreferencesModal from './components/PreferencesModal';
import DragDropProvider from './hooks/dragndrop/provider';
import { ICard } from './store/deck/types';
import { canMoveToFoundation, canMoveToPile, isGameOver } from './store/deck/gameRules';
import { moveFromFoundationToFoundation, moveFromFoundationToPile, moveFromPileToFoundation, moveFromPileToPile, moveFromStockToFoundation, moveFromStockToPile } from './store/deck/deckSlice';
import StatisticsModal from './components/StatisticsModal';
import { cardSound, applauseSound } from './sounds';

function App() {
    const timeControl = useAppSelector(state => state.game.timeControl);
    const autoMove = useAppSelector(state => state.game.autoMove);
    const isOver = useAppSelector(state => state.game.isOver);
    const sounds = useAppSelector(state => state.game.sounds);
    const piles = useAppSelector(state => state.deck.present.piles);
    const foundations = useAppSelector(state => state.deck.present.foundations);
    const stock = useAppSelector(state => state.deck.present.stock.upturned);
    const dispatch = useAppDispatch();

    const moved = useRef<boolean>();
    useEffect(() => {
        if (moved.current) {
            doAutoMove();
        }
    });

    const doAutoMove = () => {
        moved.current = false;

        if (tryMoveFromStockToFoundations(stock)) {
            moved.current = true;
            return;
        }
        if (tryMoveFromPilesToFoundations()) {
            moved.current = true;
            return;
        }
    };

    const tryMoveFromStockToFoundations = useCallback((stock: ICard[]) => {
        const upturnedStockLastCard = stock.length ? stock[stock.length - 1] : null;
        if (upturnedStockLastCard === null) {
            return false;
        }

        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveToFoundation([upturnedStockLastCard], foundations[foundationIndex])) {
                dispatch(moveFromStockToFoundation(foundationIndex));
                if (sounds) {
                    cardSound.play();
                }
                return true;
            }
        }
        return false;
    }, [foundations, dispatch, sounds]);

    const tryMoveFromPilesToFoundations = () => {
        for (let pileIndex = 0; pileIndex < piles.length; pileIndex++) {
            const pile = piles[pileIndex];
            if (tryMoveFromPileToFoundations(pileIndex, pile)) {
                return true;
            }
        }
        return false;
    };

    const tryMoveFromPileToFoundations = useCallback((pileIndex: number, pile: ICard[]) => {
        const pileLastCard = pile.length ? pile[pile.length - 1] : null;
        if (pileLastCard === null || !pileLastCard.isUpturned) {
            return false;
        }
        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveToFoundation([pileLastCard], foundations[foundationIndex])) {
                dispatch(moveFromPileToFoundation({ fromIndex: pileIndex, toIndex: foundationIndex }));
                if (sounds) {
                    cardSound.play();
                }
                return true;
            }
        }
    }, [foundations, dispatch, sounds]);

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (autoMove && !isOver) {
            if (timeControl) {
                dispatch(incrementTime(10));
            }
            doAutoMove();
        }
    };

    const isDesktop = useMediaQuery(desktopQuery);
    const isMobile = useMediaQuery(mobileQuery);
    const isLandscape = useMediaQuery(landscapeQuery);

    const handleDragEnd = useCallback((sourceId: string, destinationId: string, cards: ICard[]) => {
        const source = sourceId.split('-');
        const sourceType = source[0];
        const sourceIndex = Number(source[1]);

        const destination = destinationId.split('-');
        const destinationType = destination[0];
        const destinationIndex = Number(destination[1]);

        if (destinationType === 'foundation' && canMoveToFoundation(cards, foundations[destinationIndex])) {
            if (sourceType === 'stock') {
                dispatch(moveFromStockToFoundation(destinationIndex));
            } else if (sourceType === 'foundation') {
                dispatch(moveFromFoundationToFoundation({ fromIndex: sourceIndex, toIndex: destinationIndex }));
            } else if (sourceType === 'pile') {
                dispatch(moveFromPileToFoundation({ fromIndex: sourceIndex, toIndex: destinationIndex }));
            }
            if (sounds) {
                cardSound.play();
            }
        } else if (destinationType === 'pile' && canMoveToPile(cards, piles[destinationIndex])) {
            if (sourceType === 'stock') {
                dispatch(moveFromStockToPile(destinationIndex));
            } else if (sourceType === 'foundation') {
                dispatch(moveFromFoundationToPile({ fromIndex: sourceIndex, toIndex: destinationIndex }));
            } else if (sourceType === 'pile') {
                dispatch(moveFromPileToPile({ fromIndex: sourceIndex, toIndex: destinationIndex, cards }));
            }
            if (sounds) {
                cardSound.play();
            }
        }
    }, [foundations, piles, sounds, dispatch]);

    useEffect(() => {
        if (isGameOver(foundations)) {
            dispatch(gameOver());
            if (sounds) {
                applauseSound.play();
            }
        }
    }, [foundations, dispatch, sounds]);

    useEffect(() => {
        dispatch(start());
    }, [dispatch]);

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
                    alignItems="flex-start"
                >
                    <Controls />
                    {timeControl && <Timer />}
                </Stack>

                <Box sx={{flexGrow: 1}}>
                    <Grid container columns={7} spacing={'1%'} direction={isMobile ? 'row-reverse' : 'row'}>
                        <DragDropProvider onDragEnd={handleDragEnd}>
                            <Grid item xs={3}>
                                <Stock onMoveToFoundations={tryMoveFromStockToFoundations} />
                            </Grid>
                            <Grid item xs={4}>
                                <Foundations />
                            </Grid>
                            <Grid item xs={7}>
                                <Piles onMoveToFoundations={tryMoveFromPileToFoundations} />
                            </Grid>
                        </DragDropProvider>
                    </Grid>
                </Box>
            </Stack>

            <WinModal />
            <PreferencesModal />
            <StatisticsModal />
        </Box>
    );
}

export default App;
