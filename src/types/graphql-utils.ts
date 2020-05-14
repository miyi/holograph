import { RedisClient } from "redis"

export type Resolver = (
  parent: any,
  args: any,
  context: {
    redis: RedisClient
    url: string
    session: any
  },
  info: any,
) => any

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: {
    redis: RedisClient
    url: string
    session: any
  },
  info: any,
) => any
export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver
  }
}