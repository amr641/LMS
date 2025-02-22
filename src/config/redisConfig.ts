import Redis from "ioredis";

export const redisServices = new Redis({
    host: process.env.REDIS_HOST || "redis",
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => {
      // Retry for up to 10 times
      if (times < 10) {
        return 10000;  // Retry after 10 seconds
      }
      return null;  // Stop retrying after 10 attempts
    },
  });
  
  redisServices.on("connect", () => {
    console.log("✅ Redis connected successfully");
  }).on("error", () => {
    console.error("❌ Redis connection error");
  });