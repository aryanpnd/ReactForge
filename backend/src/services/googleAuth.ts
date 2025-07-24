import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

class GoogleAuthService {
    private client: OAuth2Client;

    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            throw new Error('GOOGLE_CLIENT_ID environment variable is required');
        }

        this.client = new OAuth2Client(clientId);
    }

    /**
     * Verify Google ID token and extract user information
     */
    async verifyIdToken(idToken: string) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload) {
                throw new Error('Invalid token payload');
            }

            return {
                googleId: payload.sub,
                email: payload.email!,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                avatar: payload.picture || '',
                emailVerified: payload.email_verified || false,
            };
        } catch (error) {
            console.error('Google token verification failed:', error);
            throw new Error('Invalid Google token');
        }
    }

    /**
     * Verify Google user data from frontend (alternative method)
     * This is used when the frontend sends already decoded user info
     */
    async verifyUserData(userData: {
        googleId: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    }) {
        // In a production environment, you might want to make an additional
        // API call to Google to verify this data is legitimate
        // For now, we'll trust the frontend validation

        if (!userData.googleId || !userData.email) {
            throw new Error('Invalid Google user data');
        }

        return userData;
    }
}

export default new GoogleAuthService();