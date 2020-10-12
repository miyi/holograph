import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import RateLimit from 'express-rate-limit'
import session from 'express-session'
import {
  redis,
  asyncRedis,
  RedisStore,
  RateLimitRedisStore,
} from './server_configs/redisServer'
import { ContextIntegration, AddressInfo } from './types/server-utils'
import { routes } from './routes/routes'
import { Server } from 'http'
import { prepareGQLDocuments } from './server_configs/prepareGQLDocs'
import { createTypeormConnection } from './server_configs/createTypeOrmConnection'

const limit = RateLimit({
  store: new RateLimitRedisStore({
    client: redis as any,
  }),
  windowMs: 1000 * 60 * 15, //15 min
  max: 100, //100 req limit per interval
})

export const startApolloServer = (
  port: number = 0,
  address: string = 'localhost',
): Promise<Server> =>
  new Promise<Server>(async (resolve) => {
    {
      const { resolvers, typeDefs } = await prepareGQLDocuments()
      await createTypeormConnection()
      const graphqlServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }: ContextIntegration) => ({
          redis: asyncRedis,
          url: 'http://' + req.get('host'),
          session: req.session,
        }),
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
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
      const corsOptions = { credentials: true, origin: '*' }
      graphqlServer.applyMiddleware({
        app,
        cors: corsOptions,
        path: '/graphql',
      })

      const httpServer = app.listen(port, address, () => {
        process.env.HOST_URL =
          'http://' +
          (httpServer.address() as AddressInfo).address +
          ':' +
          (httpServer.address() as AddressInfo).port
        console.log('listening on: ', process.env.HOST_URL)
        resolve(httpServer)
      })
    }
  })
