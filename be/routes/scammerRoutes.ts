import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { createScammer, getScammers, searchScammer } from '../controllers/scammerController';

const router = express.Router();

// Use the proper controller functions instead of inline implementations
router.post('/', authenticateToken, createScammer);
router.get('/', authenticateToken, getScammers);
router.get('/search', authenticateToken, searchScammer);

export default router;