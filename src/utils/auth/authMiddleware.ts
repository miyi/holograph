import { AuthenticationError } from 'apollo-server-errors'
import { Post } from '../../entity/Post'
import { Resolver, GraphqlContext } from '../../types/graphql-utils'
import { verifyLogin } from './auth-utils'
import { genericAuthError, notLoggedIn } from './AuthErrors'

export const isLoggedInMiddleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => {
  // middleware
  const isLoggedIn = await verifyLogin(context.session, context.redis)
  if (isLoggedIn) {
    return await resolver(parent, args, context, info)
  } else {
    throw new AuthenticationError(notLoggedIn)
  }
  // afterware
}

export const isPostAuthorMiddleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => {
  if (args?.id) {
    let post = await Post.findOne({
      relations: ['author'],
      where: {
        id: args.id,
      },
    })
    if (post && post.author.id === context.session.userId) {
      return await resolver({ ...parent, post }, args, context, info)
    }
  } else {
    throw new AuthenticationError(genericAuthError)
  }
}
