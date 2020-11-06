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
    let post = await Posts.findOne({
      relations: ['author'],
      where: {
        id: args.id,
      },
    })
    if (post && post.author.id === context.session.userId) {
      result = await resolver({ ...parent, post}, args, context, info)
    }
  }
  return result
}
