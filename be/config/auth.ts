import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { User } from '../models/User';
import { Request } from 'express';
import fetch from 'node-fetch';



console.log('NODE_ENV value:', process.env.NODE_ENV);
console.log('LINKEDIN_CALLBACK_URL_PROD value:', process.env.LINKEDIN_CALLBACK_URL_PROD);
console.log('LINKEDIN_CALLBACK_URL_DEV value:', process.env.LINKEDIN_CALLBACK_URL_DEV);
// Determine the callback URL based on the environment
const LINKEDIN_CALLBACK_URL = process.env.NODE_ENV === 'production'
    ? process.env.LINKEDIN_CALLBACK_URL_PROD
    : process.env.LINKEDIN_CALLBACK_URL_DEV || 'http://localhost:3005/api/auth/linkedin/callback';

console.log('LinkedIn callback URL in BE auth.ts:', LINKEDIN_CALLBACK_URL);

export const setupPassport = () => {
    // Configura la strategia LinkedIn per Passport
    passport.use(new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID || '',
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
            callbackURL: LINKEDIN_CALLBACK_URL,
            scope: ['openid', 'profile'],
            passReqToCallback: true,
            state: true,
            // Disabilita il recupero automatico del profilo
            skipUserProfile: true
        } as any,
        async (req: Request, accessToken: string, refreshToken: string, params: any, done: Function) => {
            try {
                console.log('OAuth flow completed, access token received');
                console.log('Token params:', JSON.stringify(params, null, 2));

                // Recupera manualmente le informazioni del profilo dall'endpoint userinfo
                try {
                    console.log('Fetching user info from userinfo endpoint...');
                    const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
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
                        let user = await User.findOne({ linkedinId });

                        if (!user) {
                            // Crea nuovo utente
                            const displayName = userInfo.name || `linkedin_user_${linkedinId.substring(0, 8)}`;
                            console.log(`Creating new user with name: ${displayName}`);

                            user = new User({
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
                    } else {
                        console.error('Failed to fetch user info:',
                            userInfoResponse.status,
                            await userInfoResponse.text());
                        return done(new Error(`Failed to fetch user info: ${userInfoResponse.status}`));
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                    return done(error);
                }
            } catch (error) {
                console.error('LinkedIn authentication error:', error);
                return done(error);
            }
        }
    ));

    // Configure Passport authenticated session persistence
    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id: string, done: Function) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};