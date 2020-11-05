import { Posts } from '../../entity/Posts'
import { Resolver, GraphqlContext } from '../../types/graphql-utils'
import { verifyLogin } from './auth-utils'

export const authMiddleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => {
  // middleware
  let result = null
  const isLoggedIn = await verifyLogin(context.session, context.redis)
  if (isLoggedIn) {
    result = await resolver(parent, args, context, info)
  }
  // afterware
  return result
}

export const isPostAuthorMiddleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => {
  let result = null
  if (args?.id) {
    let post = Posts.findOne({
      relations: ['author'],
      where: {
        id: args.id,
      },
    })
    let isPostAuthor = {
      isPostAuthor: post,
    }
    result = await resolver({ ...parent, isPostAuthor }, args, context, info)
  }
  return result
}
