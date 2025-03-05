"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
require("../types/express");
const router = express_1.default.Router();
console.log("***************node.env from be in authRoutes begin****** ", process.env.NODE_ENV);
let frontendURL;
if (process.env.NODE_ENV === 'production') {
    frontendURL = process.env.FRONTEND_PROD_URL || 'https://prod2.example.com';
}
else {
    frontendURL = process.env.FRONTEND_LOCAL_URL || 'http://localhost:5173';
}
console.log("frontend from server authRoutes: ", frontendURL);
// Helper function to sign JWT token
const signToken = (user) => {
    const payload = {
        id: user._id.toString(),
        role: user.role
    };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '90d' };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
// Protected routes
router.get('/profile', authMiddleware_1.authenticateToken, authController_1.getUserProfile);
// router.put('/profile', authenticateToken, updateUserProfile);
router.delete('/profile', authMiddleware_1.authenticateToken, authController_1.deleteUserAccount);
// LinkedIn authentication route
router.get('/linkedin', passport_1.default.authenticate('linkedin'));
console.log("frontend from server authRoutes: ", frontendURL);
// LinkedIn callback route
router.get('/linkedin/callback', passport_1.default.authenticate('linkedin', {
    session: false,
    failureRedirect: `${frontendURL}/login?error=auth_failed`
}), (req, res) => {
    try {
        const user = req.user;
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
    }
    catch (error) {
        console.error('LinkedIn callback error:', error);
        res.redirect(`${frontendURL}/login?error=server_error`);
    }
});
// In authRoutes.ts
router.get('/linkedin-config', (req, res) => {
    res.json({
        callbackUrl: process.env.NODE_ENV === 'production'
            ? process.env.LINKEDIN_CALLBACK_URL_PROD
            : process.env.LINKEDIN_CALLBACK_URL_DEV,
        nodeEnv: process.env.NODE_ENV
    });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map