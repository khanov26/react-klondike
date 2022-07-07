import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react'
import { closeStatistics } from '../store/game/gameSlice';
import { formatTime } from '../store/game/time';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import BaseModal from './BaseModal';

const StatisticsModal: React.FC = () => {
    const dispatch = useAppDispatch();

    const isOpen = useAppSelector(state => state.game.isStatisticsOpen);
    const playedGamesCount = useAppSelector(state => state.game.playedGamesCount);
    const wonGamesCount = useAppSelector(state => state.game.wonGamesCount);
    const bestTime = useAppSelector(state => state.game.bestTime);
    const wonGamesPercentage = playedGamesCount ? Math.round(wonGamesCount / playedGamesCount * 100) : 0;

    const handleClose = () => {
        dispatch(closeStatistics());
    };

    const modalContent = (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Typography>Сыграно игр</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{playedGamesCount}</Typography>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Typography>Выиграно</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{wonGamesCount} ({wonGamesPercentage}%)</Typography>
                    </TableCell>
                </TableRow>
                {bestTime > 0 &&
                <TableRow>
                    <TableCell>
                        <Typography>Рекорд</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{formatTime(bestTime)}</Typography>
                    </TableCell>
                </TableRow>
                }
            </TableBody>
        </Table>
    );

    return (
        <BaseModal
            open={isOpen}
            onClose={handleClose}
            headerText="Статистика"
            content={modalContent}
        />
    )
}

export default React.memo(StatisticsModal);
