import session from 'express-session';
import RedisStore from 'connect-redis';
import RedisClient from './redis';

// Extend session data type
declare module 'express-session' {
    interface SessionData {
        userId?: string;
        user?: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar?: string;
            provider: 'email' | 'google';
        };
    }
}

export const createSessionConfig = () => {
    const redisClient = RedisClient.getInstance().getClient();

    return session({
        store: new RedisStore({
            client: redisClient,
            prefix: 'reactforge:sess:',
        }),
        name: 'reactforge.sid', // Session cookie name
        secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        rolling: true, // Reset expiration on activity
        cookie: {
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            httpOnly: true, // Prevent XSS attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        },
    });
};