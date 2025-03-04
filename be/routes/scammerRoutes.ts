import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createScammer,
    getScammers,
    searchScammer,
    deleteReport
} from '../controllers/scammerController';

const router = express.Router();

// Scammer routes
router.post('/', authenticateToken, createScammer);
router.get('/', authenticateToken, getScammers);
router.get('/search', authenticateToken, searchScammer);
// Nuova rotta per eliminare un report
router.delete('/:scammerId/reports/:reportId', authenticateToken, deleteReport);

export default router;