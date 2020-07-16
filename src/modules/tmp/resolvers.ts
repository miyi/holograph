import { GraphqlContext } from './../../types/graphql-utils'
import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryHelloArgs,
  QueryGetRedisArgs,
  MutationSetRedisArgs,
  MutationDelRedisArgs,
} from '../../types/graphql'

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: QueryHelloArgs) => `Hello ${name || 'World'}`,
    url: (_: void, __: void, context: any) => {
      return context.url
    },
    readSessionDummy1: (_: void, __: void, context: GraphqlContext) => {
      console.log(context.session)
      return context.session.dummy1
    },
    readSessionDummy2: (_: void, __: void, context: GraphqlContext) => {
      return context.session.dummy2
    },
    getRedis: async (
      _,
      { key }: QueryGetRedisArgs,
      { redis }: GraphqlContext,
    ) => {
      return await redis('get', [key])
    },
  },
  Mutation: {
    setSessionDummy1: (_: void, __: void, context: GraphqlContext) => {
      context.session.dummy1 = true
      return 'dummy1 set'
    },
    setSessionDummy2: (_: void, __: void, context: GraphqlContext) => {
      context.session.dummy2 = true
      return 'dummy2 set'
    },
    setRedis: async (
      _,
      { key, value }: MutationSetRedisArgs,
      { redis }: GraphqlContext,
    ) => {
      return await redis('set', [key, value])
    },
    delRedis: async (
      _,
      { key }: MutationDelRedisArgs,
      { redis }: GraphqlContext,
    ) => {
      return await redis('del', [key])
    },
  },
}
