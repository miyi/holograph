import { GraphqlContext } from '../../types/graphql-utils'
import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryGetFullNameArgs,
  QueryHelloAllArgs,
  QueryAddThreeToThisArgs,
} from '../../types/graphql'
import {
  QueryHelloArgs,
  QueryGetRedisArgs,
  MutationSetRedisArgs,
  MutationDelRedisArgs,
} from '../../types/graphql'
import { addOneMiddleware, createMiddlewareResolver } from './testMiddleware'

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: QueryHelloArgs) => `Hello ${name || 'World'}`,
    helloAll: (_, { stringArray }: QueryHelloAllArgs) => {
      let response = 'Hello '
      stringArray?.forEach((e) => {
        response = response + e + ' '
      })
      return response.trim() + '!'
    },
    url: (_: void, __: void, context: any) => {
      return context.url
    },
    readSessionDummy1: (_: void, __: void, context: GraphqlContext) => {
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
    getFullName: async (_, { input }: QueryGetFullNameArgs) => {
      let { firstName, lastName } = input
      return firstName + ' ' + lastName
    },
    addThreeToThis: createMiddlewareResolver(
      addOneMiddleware,
      addOneMiddleware,
      addOneMiddleware,
      (_: any, { num }: QueryAddThreeToThisArgs) => {
        console.log('resolver num: ', num);
        return num
      },
    ),
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
