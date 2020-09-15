import { createClient } from 'redis';
import connectRedis from 'connect-redis'
import session from 'express-session'
import { promisify } from 'util'

interface AsyncRedis {
  (command: string, values: Array<number|string>): Promise<any>
}

const redis = createClient()
const RedisStore = connectRedis(session)
const asyncRedis: AsyncRedis = promisify(redis.sendCommand).bind(redis)

redis.on("error", function(error) {
  console.error(error);
})

export { redis, asyncRedis, RedisStore, AsyncRedis }