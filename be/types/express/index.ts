import { Request } from 'express';
import { IUser } from '../../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;  // Using IUser directly instead of UserPayload
        }
    }
}

export { };