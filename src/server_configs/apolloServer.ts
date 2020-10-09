import { asyncRedis } from './redisServer'
import { ContextIntegration } from '../types/server-utils'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { prepareGQLDocuments } from '../utils/prepareGQLDocuments'

const initApolloServer = (app: Express) => {
  const { resolvers, typeDefs } = prepareGQLDocuments()
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
}

export { initApolloServer }