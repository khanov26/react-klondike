import React from 'react';
import {Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, useMediaQuery} from "@mui/material";
import {Menu as MenuIcon, PowerSettingsNew, Redo, Replay, Undo} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {start, restart} from '../store/game/gameSlice';
import {ActionCreators} from 'redux-undo';
import {isDesktopQuery, isTabletQuery} from "../mediaQueries";

const Controls: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const dispatch = useAppDispatch();

    const canUndo = useAppSelector(state => state.deck.past.length > 0);
    const canRedo = useAppSelector(state => state.deck.future.length > 0);

    const handleNewGameButtonClick = () => {
        dispatch(start());
        dispatch(ActionCreators.clearHistory());
    };

    const handleTryAgainButtonClick = () => {
        dispatch(restart());
        dispatch(ActionCreators.clearHistory());
    };

    const isDesktop = useMediaQuery(isDesktopQuery);
    const isTablet = useMediaQuery(isTabletQuery);
    let fontSize: 'small' | 'medium' | 'large';
    if (isDesktop || isTablet) {
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
                        <ListItemText>Новая игра</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleTryAgainButtonClick}>
                        <ListItemIcon>
                            <Replay/>
                        </ListItemIcon>
                        <ListItemText>Попробовать снова</ListItemText>
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => dispatch(ActionCreators.undo())} disabled={!canUndo}>
                        <ListItemIcon>
                            <Undo/>
                        </ListItemIcon>
                        <ListItemText>Отменить ход</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(ActionCreators.redo())} disabled={!canRedo}>
                        <ListItemIcon>
                            <Redo/>
                        </ListItemIcon>
                        <ListItemText> Повторить ход</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

export default React.memo(Controls);