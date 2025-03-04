import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import '../types/express';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const secret = process.env.JWT_SECRET || '';
        const decoded = jwt.verify(token, secret) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
};