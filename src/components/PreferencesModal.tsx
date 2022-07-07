import React from 'react';
import { Box, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closePreferences, toggleTimeControl, toggleAutoMove, toggleAutoOpen, toggleUndoAvailable, toggleSounds } from '../store/game/gameSlice';
import BaseModal from './BaseModal';

const PreferencesModal: React.FC = () => {
    const isOpen = useAppSelector(state => state.game.isPreferencesOpen);
    const isNewGame = useAppSelector(state => state.game.isNewGame);
    const timeControl = useAppSelector(state => state.game.timeControl);
    const autoMove = useAppSelector(state => state.game.autoMove);
    const autoOpen = useAppSelector(state => state.game.autoOpen);
    const undoAvailable = useAppSelector(state => state.game.undoAvailable);
    const sounds = useAppSelector(state => state.game.sounds);
    const dispatch = useAppDispatch();
    const handleClose = () => {
        dispatch(closePreferences());
    };

    const modalContent = (
        <Box sx={{
            overflow: 'auto',
            mx: -4,
            px: 4,
        }}>
            <FormControlLabel
                label="Играть на время"
                control={
                    <Checkbox
                        checked={timeControl}
                        onChange={() => dispatch(toggleTimeControl())}
                        disabled={!isNewGame}
                    />}
                title={!isNewGame ? 'Начните новую игру, чтобы изменить этот параметр' : undefined}
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
                label={
                    <Box component="span">
                        Расставлять карты по домам двойным нажатием <br />
                        {timeControl &&
                            <Typography variant="caption">+10 секунд ко времени</Typography>
                        }
                    </Box>
                }
                control={
                    <Checkbox
                        checked={autoMove}
                        onChange={() => dispatch(toggleAutoMove())}
                    />}
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
                label="Открывать последнюю карту стопки автоматически"
                control={
                    <Checkbox
                        checked={autoOpen}
                        onChange={() => dispatch(toggleAutoOpen())}
                    />
                }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
                label={
                    <Box component="span">
                        Отмена ходов <br />
                        {timeControl &&
                            <Typography variant="caption">+5 секунд ко времени</Typography>
                        }
                    </Box>
                }
                control={
                    <Checkbox
                        checked={undoAvailable}
                        onChange={() => dispatch(toggleUndoAvailable())}
                    />
                }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
                label="Включить звуки"
                control={
                    <Checkbox
                        checked={sounds}
                        onChange={() => dispatch(toggleSounds())}
                    />
                }
            />

        </Box>
    );

    return (
        <BaseModal
            open={isOpen}
            onClose={handleClose}
            headerText="Настройки"
            content={modalContent}
        />
    )
}

export default PreferencesModal;
