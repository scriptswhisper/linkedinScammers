import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { User } from '../models/User';

const router = express.Router();

// Get user profile
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Update user profile
router.put('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: req.body },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});

export default router;