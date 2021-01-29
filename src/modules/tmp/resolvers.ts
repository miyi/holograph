import { GraphqlContext } from '../../types/graphql-utils'
import { ResolverMap } from '../../types/graphql-utils'
import { QueryGetFullNameArgs, QueryReturnArrayArgs } from '../../types/graphql';
import {
  QueryHelloArgs,
  QueryGetRedisArgs,
  MutationSetRedisArgs,
  MutationDelRedisArgs,
} from '../../types/graphql'

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: QueryHelloArgs) => `Hello ${name || 'World'}`,
    returnArray: async (_, { stringArray }: QueryReturnArrayArgs) => {
      console.log('resolver: ', stringArray);
      let response = ''
      stringArray?.forEach((e) => {
        response = response + e + ' '
        console.log('tick');
      })
      console.log('resolver last: ', response.trim());
      return response.trim()
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
