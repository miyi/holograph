import express from 'express'
import RateLimit from 'express-rate-limit'
import session from 'express-session'
import { createServer } from 'http'
import { Server } from 'http'
import { RateLimitRedisStore, RedisStore, redis } from './redisServer'
import { routes } from './routes/routes'

const limit = RateLimit({
  store: new RateLimitRedisStore({
    client: redis as any,
  }),
  windowMs: 1000 * 60 * 15, //15 min
  max: 100, //100 req limit per interval
})

const app = express()
app.use(limit)
app.use(
	session({
		store: new RedisStore({
			client: redis as any,
		}),
		name: 'qid',
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: false,
			sameSite: false,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
	}),
)
app.use('/', routes)
//for axios
app.set('trust proxy', 1)

const httpServer: Server = createServer(app)

export {
	app,
	httpServer,
}