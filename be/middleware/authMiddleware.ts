import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            userId?: string;
        }
    }
}

interface JwtPayload {
    id: string;
}

interface AuthDebugInfo {
    timestamp: string;
    method: string;
    path: string;
    headers?: Record<string, string>;
    tokenPresent: boolean;
    userId?: string;
    error?: string;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const debugInfo: AuthDebugInfo = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        tokenPresent: false
    };

    try {
        console.log('\n=== Auth Middleware Start ===');
        console.log(`📍 ${debugInfo.timestamp}`);
        console.log(`📤 ${req.method} ${req.path}`);

        const token = req.header('Authorization')?.replace('Bearer ', '');
        debugInfo.tokenPresent = !!token;

        if (!token) {
            console.log('❌ Auth failed: No token provided');
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JwtPayload;
        debugInfo.userId = decoded.id;
        console.log('✅ Token verified successfully');

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('❌ User not found in database');
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        req.userId = decoded.id;
        console.log('✅ User authenticated:', { id: user._id, email: user.email });
        next();
    } catch (error) {
        debugInfo.error = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Auth middleware error:', debugInfo);
        res.status(401).json({ message: 'Authentication failed' });
    }
};