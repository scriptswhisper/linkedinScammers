import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

// Tipo per i middleware Express
export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// Estensione del namespace Express per il tipo User
declare global {
    namespace Express {
        interface User extends IUser { }

        interface Request {
            user?: User;
        }
    }
}