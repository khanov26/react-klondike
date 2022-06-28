import React from 'react';
import {Grid, Box, useMediaQuery, Stack} from '@mui/material';
import Stock from './components/Stock';
import Foundations from './components/Foundations';
import Piles from './components/Piles';
import Controls from "./components/Controls";
import WinModal from "./components/WinModal";
import Timer from "./components/Timer";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {incrementTime} from "./store/game/gameSlice";
import {isDesktopQuery, isLandscapeQuery} from "./mediaQueries";
import Preferences from './components/Preferences';
import useAutoMove from './hooks/autoMove';

function App() {
    const timeControl = useAppSelector(state => state.game.timeControl);
    const autoMove = useAppSelector(state => state.game.autoMove);
    const dispatch = useAppDispatch();

    const doAutoMove = useAutoMove();

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (autoMove) {
            dispatch(incrementTime(10));
            doAutoMove();
        }
    };

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
                    alignItems="flex-start"
                >
                    <Controls/>
                    {timeControl && <Timer/>}
                </Stack>

                <Box>
                    <Grid container columns={7} spacing={'1%'}>
                        <Grid item xs={3}>
                            <Stock/>
                        </Grid>
                        <Grid item xs={4}>
                            <Foundations/>
                        </Grid>
                        <Grid item xs={7}>
                            <Piles/>
                        </Grid>
                    </Grid>
                </Box>
            </Stack>

            <WinModal/>
            <Preferences/>
        </Box>
    );
}

export default App;
