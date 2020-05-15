import { createClient } from 'redis'
import connectRedis from 'connect-redis'

const RedisClient = createClient()
const RedisStore = connectRedis(session)
