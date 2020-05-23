import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import session from 'express-session'

const redisClient = createClient()
const RedisStore = connectRedis(session)

redisClient.on("error", function(error) {
  console.error(error);
})

export { redisClient, RedisStore }