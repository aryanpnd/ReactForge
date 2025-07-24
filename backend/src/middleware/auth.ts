import { Request, Response, NextFunction } from 'express';

// Extend Request type to include user
declare global {
    namespace Express {
        interface Request {
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
}

// Middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
    }

    // Attach user to request object
    req.user = req.session.user;
    next();
};

// Middleware to check if user is already authenticated (for login/signup routes)
export const requireGuest = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        return res.status(400).json({
            success: false,
            message: 'Already authenticated',
        });
    }

    next();
};