"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Get user profile
router.get('/me', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});
// // Update user profile
// router.put('/me', authenticateToken, async (req: Request, res: Response) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             req.user?._id,
//             { $set: req.body },
//             { new: true }
//         );
//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         res.status(500).json({ message: 'Error updating user profile' });
//     }
// });
exports.default = router;
//# sourceMappingURL=userRoutes.js.map