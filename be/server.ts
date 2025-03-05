import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { connectDB } from './config/db';
import { setupPassport } from './config/auth';
import userRoutes from './routes/userRoutes';
import scammerRoutes from './routes/scammerRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;



// Update to this
const corsOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_LOCAL_URL || 'http://localhost:5173';

console.log('CORS origin set to:', corsOrigin);

app.use(cors({
    origin: corsOrigin,
    credentials: true
}));
// Session setup for passport
app.use(session({
    secret: process.env.JWT_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
setupPassport();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scammers', scammerRoutes);

// Start server only when directly executed (not imported for tests)
const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB first
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server failed to start:', error);
        process.exit(1);
    }
};

// Only start server if this file is run directly
if (require.main === module) {
    startServer();
}

export { app, startServer };