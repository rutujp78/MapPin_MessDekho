const redis = require("redis");
const redisClient = redis.createClient();

async function initRedis() {
    await redisClient.connect();
    
    redisClient.on("error", err => console.log('Redis Client Error', err));
    redisClient.on("ready", () => {
        console.log("Redis client started");
    });
    
    await redisClient.ping();
}

module.exports = { initRedis, redisClient };