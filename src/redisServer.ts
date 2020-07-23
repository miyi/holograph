import { createClient } from 'redis';
import connectRedis from 'connect-redis'
import session from 'express-session'
import { promisify } from 'util'

const redis = createClient()
const RedisStore = connectRedis(session)
const asyncRedis: any = promisify(redis.sendCommand).bind(redis)

redis.on("error", function(error) {
  console.error(error);
})

export { redis, asyncRedis, RedisStore }