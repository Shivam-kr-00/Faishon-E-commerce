import Redis from "ioredis";
import dotenv from 'dotenv';

dotenv.config();

// Ensure the client explicitly handles the secure TLS handshake required by Upstash
export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    tls: {
        rejectUnauthorized: false // Prevents connection rejections on cloud environments
    },
    maxRetriesPerRequest: null // Prevents crashing if the connection drops momentarily
});

// CRITICAL: Add an error listener so connection drops don't crash your server
redis.on('error', (err) => {
    console.error('[ioredis] Connection Error:', err.message);
});

redis.on('connect', () => {
    console.log('Successfully connected to Upstash Redis!');
});