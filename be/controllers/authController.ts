import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import '../types/express';

// // JWT token generation
// const generateToken = (userId: string): string => {
//     const payload = { id: userId };
//     const secret = process.env.JWT_SECRET || 'your_jwt_secret';
//     const options = { expiresIn: process.env.JWT_EXPIRES_IN || '30d' } as jwt.SignOptions;
//     return jwt.sign(payload, secret, options);
// };

// Get current user profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// // Update user profile
// export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const user = await User.findById(req.user?._id);

//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }

//         const { username, email } = req.body;

//         if (username) user.username = username;


//         await user.save();

//         res.json({
//             message: 'Profile updated successfully',
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 profilePicture: user.profilePicture
//             }
//         });
//     } catch (error) {
//         console.error('Update profile error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// Delete user account
export const deleteUserAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        await User.findByIdAndDelete(req.user?._id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};