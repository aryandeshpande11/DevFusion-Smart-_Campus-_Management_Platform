// redis is used for otp storage, refresh token blacklist/whitelist, and simple caching
const Redis = require('ioredis');
const env = require('./env');

const redisClient = new Redis(env.redisUrl);

redisClient.on('connect', () => console.log('redis connected'));
redisClient.on('error', (err) => console.error('redis error:', err.message));

module.exports = redisClient;
