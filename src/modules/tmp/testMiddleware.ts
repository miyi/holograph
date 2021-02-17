import {
  MiddlewareStack,
  Resolver,
  ResolverMiddleware,
} from '../../types/graphql-utils'

const createMiddlewareResolver = (
  ...middlewareStack: MiddlewareStack
) => async (parent: any, args: any, context: any, info: any) => {
  let nextStack = middlewareStack.slice(1)
  return await middlewareStack[0](nextStack, parent, args, context, info)
}

const addOneMiddleware: ResolverMiddleware = async (
  middlewareStack: MiddlewareStack,
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  if (!middlewareStack) return null
  args.num += 1
  if (middlewareStack.length < 2) {
    let resolver: Resolver = middlewareStack[middlewareStack.length - 1]
    return await resolver(parent, args, context, info)
  } else {
    let nextStack = middlewareStack.slice(1)
    let res = await middlewareStack[0](nextStack, parent, args, context, info)
    return res
  }
}

export { createMiddlewareResolver, addOneMiddleware }
