import { ApolloServer } from 'apollo-server-express'
import { app, httpServer } from './expressApp'
// import cors from 'cors'
import { asyncRedis } from './redisServer'
import { ContextIntegration, AddressInfo } from './types/server-utils'
import { Server } from 'http'
import { prepareGQLDocuments } from './utils/prepareGQLDocuments'
import { createTypeormConnection } from './utils/createConnection'

export const startApolloServer = (
  port: number = process.env.NODE_ENV === 'DEV' ? 4000 : 0,
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
      const corsOptions = { credentials: true, origin: '*' }
      graphqlServer.applyMiddleware({
        app,
        cors: corsOptions,
        path: '/graphql',
      })
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
