import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import googleAuthService from '../services/googleAuth';

export class AuthController {
    /**
     * Email signup
     */
    async signup(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists',
                });
            }

            // Create new user
            const user = new User({
                firstName,
                lastName,
                email,
                password,
                provider: 'email',
            });

            await user.save();

            // Create session
            req.session.userId = user._id;
            req.session.user = {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                provider: user.provider,
            };

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                user: req.session.user,
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * Email login
     */
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email, provider: 'email', isActive: true });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Create session
            req.session.userId = user._id;
            req.session.user = {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                provider: user.provider,
            };

            res.json({
                success: true,
                message: 'Login successful',
                user: req.session.user,
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * Google OAuth login/signup
     */
    async googleAuth(req: Request, res: Response) {
        try {
            const { googleId, email, firstName, lastName, avatar } = req.body;

            // Verify Google user data
            const googleUserData = await googleAuthService.verifyUserData({
                googleId,
                email,
                firstName,
                lastName,
                avatar,
            });

            // Check if user exists
            let user = await User.findOne({
                $or: [
                    { googleId: googleUserData.googleId },
                    { email: googleUserData.email, provider: 'google' }
                ]
            });

            if (user) {
                // Update user data if needed
                user.firstName = googleUserData.firstName;
                user.lastName = googleUserData.lastName;
                user.avatar = googleUserData.avatar;
                user.googleId = googleUserData.googleId;
                await user.save();
            } else {
                // Check if email exists with different provider
                const emailExists = await User.findOne({ email: googleUserData.email });
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'An account with this email already exists. Please sign in with email and password.',
                    });
                }

                // Create new user
                user = new User({
                    firstName: googleUserData.firstName,
                    lastName: googleUserData.lastName,
                    email: googleUserData.email,
                    avatar: googleUserData.avatar,
                    provider: 'google',
                    googleId: googleUserData.googleId,
                });

                await user.save();
            }

            // Create session
            req.session.userId = user._id;
            req.session.user = {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                provider: user.provider,
            };

            res.json({
                success: true,
                message: 'Google authentication successful',
                user: req.session.user,
            });
        } catch (error) {
            console.error('Google auth error:', error);
            res.status(500).json({
                success: false,
                message: 'Google authentication failed',
            });
        }
    }

    /**
     * Logout
     */
    async logout(req: Request, res: Response) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destroy error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Logout failed',
                    });
                }

                res.clearCookie('reactforge.sid');
                res.json({
                    success: true,
                    message: 'Logout successful',
                });
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * Get current user
     */
    async me(req: Request, res: Response) {
        try {
            if (!req.session.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authenticated',
                });
            }

            res.json({
                success: true,
                user: req.session.user,
            });
        } catch (error) {
            console.error('Me route error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}

export default new AuthController();