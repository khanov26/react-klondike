import { Close } from '@mui/icons-material';
import { IconButton, Modal, Paper, Typography } from '@mui/material';
import React from 'react'

interface Props {
    headerText?: string;
    content: React.ReactNode;
    open: boolean;
    onClose: () => void;
}

const BaseModal: React.FC<Props> = ({ headerText, content, open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} sx={{
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
                {headerText &&
                    <Typography variant="h5" sx={{ mb: 2 }}>{headerText}</Typography>
                }
                <IconButton onClick={onClose} sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                }}>
                    <Close/>
                </IconButton>

                {content}
            </Paper>
        </Modal>
    )
}

export default BaseModal;
