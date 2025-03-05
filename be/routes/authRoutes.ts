import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { getUserProfile, deleteUserAccount } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import '../types/express';

const router = express.Router();

let frontendURL: string;
if (process.env.NODE_ENV === 'production') {
  frontendURL = process.env.FRONTEND_PROD_URL || 'https://prod.example.com';
} else {
  frontendURL = process.env.FRONTEND_LOCAL_URL || 'http://localhost:5173';
}

console.log("frontend from server authRoutes: ", frontendURL)

// Helper function to sign JWT token
const signToken = (user: IUser): string => {
  const payload = {
    id: user._id.toString(),
    role: user.role
  };

  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || '90d' } as jwt.SignOptions;

  return jwt.sign(payload, secret, options);
};

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
// router.put('/profile', authenticateToken, updateUserProfile);
router.delete('/profile', authenticateToken, deleteUserAccount);

// LinkedIn authentication route
router.get('/linkedin', passport.authenticate('linkedin'));




console.log("frontend from server authRoutes: ", frontendURL)

// LinkedIn callback route
router.get('/linkedin/callback',
  passport.authenticate('linkedin', {
    session: false,
    failureRedirect: `${frontendURL}/login?error=auth_failed`
  }),
  (req, res) => {
    try {
      const user = req.user as IUser;
      const token = signToken(user);

      const userForClient = {
        id: user._id,
        username: user.username,
        role: user.role,
        profilePicture: user.profilePicture
      };

      // Create URL-safe base64 encoded user data
      const userBase64 = Buffer.from(JSON.stringify(userForClient)).toString('base64');

      // Redirect to frontend with token and user data
      res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${userBase64}`);
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      res.redirect(`${frontendURL}/login?error=server_error`);
    }
  }
);

// In authRoutes.ts
router.get('/linkedin-config', (req, res) => {
  res.json({
    callbackUrl: process.env.NODE_ENV === 'production'
      ? process.env.LINKEDIN_CALLBACK_URL_PROD
      : process.env.LINKEDIN_CALLBACK_URL_DEV,
    nodeEnv: process.env.NODE_ENV
  });
});

export default router;