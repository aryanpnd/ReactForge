import { Router } from 'express';
import authController from '../controllers/authController';
import { validate, loginSchema, signupSchema, googleAuthSchema } from '../middleware/validation';
import { requireAuth, requireGuest } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many auth attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public routes (guest only)
router.post('/signup',
    // authLimiter,
    // requireGuest,
    validate(signupSchema),
    authController.signup
);

router.post('/login',
    // loginLimiter,
    // requireGuest,
    validate(loginSchema),
    authController.login
);

router.post('/google',
    // authLimiter,
    // requireGuest,
    validate(googleAuthSchema),
    authController.googleAuth
);

// Protected routes (auth required)
router.post('/logout',
    requireAuth,
    authController.logout
);

router.get('/me',
    requireAuth,
    authController.me
);

export default router;