"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
const User_1 = require("../models/User");
const node_fetch_1 = __importDefault(require("node-fetch"));
const setupPassport = () => {
    // Configura la strategia LinkedIn per Passport
    passport_1.default.use(new passport_linkedin_oauth2_1.Strategy({
        clientID: process.env.LINKEDIN_CLIENT_ID || '',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
        callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3005/api/auth/linkedin/callback',
        scope: ['openid', 'profile'],
        passReqToCallback: true,
        state: true,
        // Disabilita il recupero automatico del profilo
        skipUserProfile: true
    }, async (req, accessToken, refreshToken, params, done) => {
        try {
            console.log('OAuth flow completed, access token received');
            console.log('Token params:', JSON.stringify(params, null, 2));
            // Recupera manualmente le informazioni del profilo dall'endpoint userinfo
            try {
                console.log('Fetching user info from userinfo endpoint...');
                const userInfoResponse = await (0, node_fetch_1.default)('https://api.linkedin.com/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    console.log('User info from OIDC endpoint:', JSON.stringify(userInfo, null, 2));
                    // Estrai l'ID LinkedIn
                    const linkedinId = userInfo.sub || 'unknown';
                    console.log(`Using LinkedIn ID: ${linkedinId}`);
                    // Cerca utente esistente
                    let user = await User_1.User.findOne({ linkedinId });
                    if (!user) {
                        // Crea nuovo utente
                        const displayName = userInfo.name || `linkedin_user_${linkedinId.substring(0, 8)}`;
                        console.log(`Creating new user with name: ${displayName}`);
                        user = new User_1.User({
                            username: displayName,
                            linkedinId,
                            profilePicture: userInfo.picture,
                            isActive: true
                        });
                        await user.save();
                        console.log(`New user created with ID: ${user._id}`);
                    }
                    // Aggiorna ultimo accesso
                    user.lastLogin = new Date();
                    await user.save();
                    return done(null, user);
                }
                else {
                    console.error('Failed to fetch user info:', userInfoResponse.status, await userInfoResponse.text());
                    return done(new Error(`Failed to fetch user info: ${userInfoResponse.status}`));
                }
            }
            catch (error) {
                console.error('Error fetching user info:', error);
                return done(error);
            }
        }
        catch (error) {
            console.error('LinkedIn authentication error:', error);
            return done(error);
        }
    }));
    // Configure Passport authenticated session persistence
    passport_1.default.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await User_1.User.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });
};
exports.setupPassport = setupPassport;
//# sourceMappingURL=auth.js.map