import React from 'react';
import {Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, useMediaQuery} from "@mui/material";
import {AutoGraph, Menu as MenuIcon, PowerSettingsNew, Redo, Replay, Settings, Undo} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {start, restart, openPrefences, incrementTime, openStatistics} from '../store/game/gameSlice';
import {ActionCreators} from 'redux-undo';
import {mobileQuery} from "../mediaQueries";
import { stockSound } from '../sounds';

const Controls: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const dispatch = useAppDispatch();

    const undoAvailable = useAppSelector(state => state.game.undoAvailable);
    const timeControl = useAppSelector(state => state.game.timeControl);
    const isOver = useAppSelector(state => state.game.isOver);
    const sounds = useAppSelector(state => state.game.sounds);

    const canUndo = useAppSelector(state => state.deck.past.length > 0) && undoAvailable;
    const canRedo = useAppSelector(state => state.deck.future.length > 0) && undoAvailable;

    const handleUndoClick = () => {
        dispatch(ActionCreators.undo());
        if (timeControl) {
            dispatch(incrementTime(5));
        }
    };

    const handleRedoClick = () => {
        dispatch(ActionCreators.redo());
        if (timeControl) {
            dispatch(incrementTime(5));
        }
    };
    
    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
        if (sounds) {
            stockSound.play();
        }
    };

    const handleTryAgainButtonClick = () => {
        dispatch(restart());
        dispatch(ActionCreators.clearHistory());
        if (sounds) {
            stockSound.play();
        }
    };

    const isMobile = useMediaQuery(mobileQuery);
    let fontSize: 'small' | 'medium' | 'large';
    if (!isMobile) {
        fontSize = 'medium';
    } else {
        fontSize = 'small';
    }

    return (
        <>
            <IconButton onClick={handleMenuIconClick} size={fontSize}>
                <MenuIcon sx={{color: 'white'}} fontSize={fontSize}/>
            </IconButton>
            <Menu
                id="app-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
            >
                <MenuList>
                    <MenuItem onClick={handleNewGameButtonClick}>
                        <ListItemIcon>
                            <PowerSettingsNew/>
                        </ListItemIcon>
                        <ListItemText>?????????? ????????</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleTryAgainButtonClick} disabled={isOver}>
                        <ListItemIcon>
                            <Replay/>
                        </ListItemIcon>
                        <ListItemText>?????????????????????? ??????????</ListItemText>
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={handleUndoClick} disabled={!canUndo}>
                        <ListItemIcon>
                            <Undo/>
                        </ListItemIcon>
                        <ListItemText>???????????????? ??????</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleRedoClick} disabled={!canRedo}>
                        <ListItemIcon>
                            <Redo/>
                        </ListItemIcon>
                        <ListItemText> ?????????????????? ??????</ListItemText>
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => dispatch(openPrefences())}>
                        <ListItemIcon>
                            <Settings/>
                        </ListItemIcon>
                        <ListItemText>??????????????????</ListItemText>
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => dispatch(openStatistics())}>
                        <ListItemIcon>
                            <AutoGraph/>
                        </ListItemIcon>
                        <ListItemText>????????????????????</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

export default React.memo(Controls);