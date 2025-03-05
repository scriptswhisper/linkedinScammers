"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const scammerController_1 = require("../controllers/scammerController");
const router = express_1.default.Router();
// Scammer routes
router.post('/', authMiddleware_1.authenticateToken, scammerController_1.createScammer);
router.get('/', authMiddleware_1.authenticateToken, scammerController_1.getScammers);
router.get('/search', authMiddleware_1.authenticateToken, scammerController_1.searchScammer);
// Nuova rotta per eliminare un report
router.delete('/:scammerId/reports/:reportId', authMiddleware_1.authenticateToken, scammerController_1.deleteReport);
exports.default = router;
//# sourceMappingURL=scammerRoutes.js.map