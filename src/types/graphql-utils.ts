export interface GraphqlContext {
  redis: any
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