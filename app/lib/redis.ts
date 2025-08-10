// @/app/lib/redis.ts

import { createClient, type RedisClientType } from 'redis';

let redisClient: RedisClientType;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });
} else {
  redisClient = createClient();
}

redisClient.on('error', err => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient, connectRedis };