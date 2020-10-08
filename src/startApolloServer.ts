import express from 'express'
import { ApolloServer } from 'apollo-server-express'
// import cors from 'cors'
import session from 'express-session'
import { redis, asyncRedis, RedisStore } from './server_configs/redisServer'
import { ContextIntegration, AddressInfo } from './types/server-utils'
import { routes } from './routes/routes'
import { Server, createServer } from 'http'
import { prepareGQLDocuments } from './utils/prepareGQLDocuments'
import { createTypeormConnection } from './utils/createConnection'

let httpServer: Server

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
      httpServer = createServer(app)
      httpServer.listen(port, address, () => {
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
