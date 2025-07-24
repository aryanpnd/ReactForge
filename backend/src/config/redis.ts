import { createClient, RedisClientType } from 'redis';

class RedisClient {
    private static instance: RedisClient;
    public client: RedisClientType;

    private constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        this.client = createClient({
            url: redisUrl,
        }) as RedisClientType;

        this.setupEventHandlers();
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    private setupEventHandlers(): void {
        this.client.on('connect', () => {
            console.log('🔄 Connecting to Redis...');
        });

        this.client.on('ready', () => {
            console.log('✅ Redis client ready');
        });

        this.client.on('error', (err) => {
            console.error('❌ Redis client error:', err);
        });

        this.client.on('end', () => {
            console.log('⚠️ Redis client disconnected');
        });

        this.client.on('reconnecting', () => {
            console.log('🔄 Redis client reconnecting...');
        });
    }

    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            console.log('✅ Redis connected successfully');
        } catch (error) {
            console.error('❌ Redis connection failed:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.client.quit();
            console.log('✅ Redis disconnected successfully');
        } catch (error) {
            console.error('❌ Error disconnecting Redis:', error);
            throw error;
        }
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        const redisInstance = RedisClient.getInstance();
        await redisInstance.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during Redis disconnect:', error);
        process.exit(1);
    }
});

export default RedisClient;