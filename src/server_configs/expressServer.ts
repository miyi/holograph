import express from 'express'
import RateLimit from 'express-rate-limit'
import session from 'express-session'
// import passport from 'passport'
import { RateLimitRedisStore, RedisStore, redis } from './redisServer'
import { routes } from '../routes/routes'
// import { passportConfig } from '../socialAuth/passportAuth'

const limit = RateLimit({
  store: new RateLimitRedisStore({
    client: redis as any,
  }),
  windowMs: 1000 * 60 * 15, //15 min
  max: 100, //100 req limit per interval
})

const createExpressApp = () => {
	const app = express()
	app.use(limit)
	app.use(
		session({
			store: new RedisStore({
				client: redis as any,
			}),
			name: 'qid',
			secret: process.env.SESSION_SECRET as string,
			resave: true,
			saveUninitialized: false,
			cookie: {
				httpOnly: false,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			},
		}),
	)
	// passportConfig(passport)
	// app.use(passport.initialize())
	app.use('/', routes)
	//for axios
	app.set('trust proxy', 1)
	return app
}



export { createExpressApp }