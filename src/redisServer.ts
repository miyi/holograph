import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import session from 'express-session'
import { promisify } from 'util'
import { AsyncRedis } from './types/server-utils'
import RateLimitRedisStore from 'rate-limit-redis'

const redis = createClient()
const RedisStore = connectRedis(session)
const asyncRedis: AsyncRedis = promisify(redis.sendCommand).bind(redis)

redis.on('error', function (error) {
  console.error(error)
})

export { redis, asyncRedis, RedisStore, RateLimitRedisStore }
