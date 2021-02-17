import { AsyncRedis } from './server-utils'

export interface GraphqlContext {
  redis: AsyncRedis
  url: string
  session: Express.Session
}

export type Resolver = (
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => any

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => any
export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver
  }
}

export type MiddlewareStack = [...any[], Resolver]

export type ResolverMiddleware = (
  middlewareStack: MiddlewareStack,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => any
