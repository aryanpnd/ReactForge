import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import configurations
import connectDB from './config/database';
import RedisClient from './config/redis';
import { createSessionConfig } from './config/session';

// Import routes  
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for rate limiting and secure cookies behind reverse proxy)
app.set('trust proxy', 1);

// Global rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(globalLimiter);
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Initialize database and Redis connections
const initializeServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect to Redis
        const redisClient = RedisClient.getInstance();
        await redisClient.connect();

        // Setup session middleware (after Redis is connected)
        app.use(createSessionConfig());

        // Routes
        app.use('/api/auth', authRoutes);

        // 404 handler
        app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Route not found',
            });
        });

        // Global error handler
        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error('Global error handler:', err);

            // Don't expose error details in production
            const message = process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : err.message;

            res.status(err.status || 500).json({
                success: false,
                message,
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
            });
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error('❌ Failed to initialize server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Initialize the server
initializeServer();