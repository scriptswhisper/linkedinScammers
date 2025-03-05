"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const db_1 = require("./config/db");
const auth_1 = require("./config/auth");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const scammerRoutes_1 = __importDefault(require("./routes/scammerRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3005;
// Update to this
const corsOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_LOCAL_URL || 'http://localhost:5173';
console.log('CORS origin set to:', corsOrigin);
app.use((0, cors_1.default)({
    origin: corsOrigin,
    credentials: true
}));
// Session setup for passport
app.use((0, express_session_1.default)({
    secret: process.env.JWT_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));
// Initialize passport
app.use(passport_1.default.initialize());
(0, auth_1.setupPassport)();
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/scammers', scammerRoutes_1.default);
// Start server only when directly executed (not imported for tests)
const startServer = async () => {
    try {
        await (0, db_1.connectDB)(); // Connect to MongoDB first
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Server failed to start:', error);
        process.exit(1);
    }
};
exports.startServer = startServer;
// Only start server if this file is run directly
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=server.js.map