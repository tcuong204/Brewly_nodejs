// config/redis.js - Phiên bản đơn giản nhất

import Redis from "redis";

const redisUrl = process.env.REDIS_URL;

let redisClient;

if (redisUrl) {
  // Production: Chỉ cần URL, Redis client tự detect TLS
  console.log("🌐 Using Render Redis");
  redisClient = Redis.createClient({
    url: redisUrl,
  });
} else {
  // Development: Localhost
  console.log("💻 Using Local Redis");
  redisClient = Redis.createClient({
    url: "redis://localhost:6379",
  });
}

// Event handlers
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis ready!");
});

// Kết nối
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect:", err.message);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});

export default redisClient;
