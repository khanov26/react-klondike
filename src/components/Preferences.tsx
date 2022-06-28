import React from 'react';
import { Box, Checkbox, Divider, FormControlLabel, IconButton, Modal, Paper, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closePreferences, toggleTimeControl, toggleAutoMove, toggleAutoOpen, toggleUndoAvailable } from '../store/game/gameSlice';

const Preferences: React.FC = () => {
    const isOpen = useAppSelector(state => state.game.isPreferencesOpen);
    const isNewGame = useAppSelector(state => state.game.isNewGame);
    const timeControl = useAppSelector(state => state.game.timeControl);
    const autoMove = useAppSelector(state => state.game.autoMove);
    const autoOpen = useAppSelector(state => state.game.autoOpen);
    const undoAvailable = useAppSelector(state => state.game.undoAvailable);
    const dispatch = useAppDispatch();
    const handleClose = () => {
        dispatch(closePreferences());
    };

    return (
        <Modal open={isOpen} onClose={handleClose} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
        }}>
            <Paper sx={{
                position: 'relative',
                maxWidth: '100%',
                p: 4,
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography variant="h5" sx={{mb: 2}}>Настройки</Typography>
                <IconButton onClick={handleClose} sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                }}>
                    <Close/>
                </IconButton>

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

                </Box>
            </Paper>
        </Modal>
    )
}

export default Preferences;
