const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.client = null;
    this.fallbackCache = new Map();
    this.isRedisConnected = false;

    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.client = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 5000,
        });

        this.client.on('connect', () => {
          console.log('Redis connected successfully.');
          this.isRedisConnected = true;
        });

        this.client.on('error', (err) => {
          console.warn('Redis connection failed. Falling back to In-Memory Cache.', err.message);
          this.isRedisConnected = false;
        });
      } catch (err) {
        console.warn('Failed to initialize Redis client. Falling back to In-Memory Cache.', err.message);
      }
    } else {
      console.log('No REDIS_URL provided. Using In-Memory Cache.');
    }
  }

  async get(key) {
    if (this.isRedisConnected && this.client) {
      try {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.error('Redis GET error:', err.message);
      }
    }

    // Fallback In-Memory cache
    const item = this.fallbackCache.get(key);
    if (!item) return null;

    // Check expiry
    if (item.expiry && Date.now() > item.expiry) {
      this.fallbackCache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key, value, ttlSeconds = 3600) {
    if (this.isRedisConnected && this.client) {
      try {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (err) {
        console.error('Redis SET error:', err.message);
      }
    }

    // Fallback In-Memory cache
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.fallbackCache.set(key, { value, expiry });
    return true;
  }

  async del(key) {
    if (this.isRedisConnected && this.client) {
      try {
        await this.client.del(key);
        return true;
      } catch (err) {
        console.error('Redis DEL error:', err.message);
      }
    }

    this.fallbackCache.delete(key);
    return true;
  }
}

module.exports = new CacheService();
