import { ForbiddenError } from 'apollo-server-errors'
import { Post } from '../../entity/Post'
import { Resolver, GraphqlContext } from '../../types/graphql-utils'
import { verifyLogin } from './auth-utils'
import {
  genericAuthError,
  notLoggedIn,
} from '../../utils/errorMessage/AuthErrors'
import { Pub } from '../../entity/Pub'

const isLoggedInMiddleware = async (
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
    throw new ForbiddenError(notLoggedIn)
  }
  // afterware
}

const isPostAuthorMiddleware = async (
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
    throw new ForbiddenError(genericAuthError)
  }
}

const isModeratorMiddleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => {
  if (args?.pubId && context.session.userId) {
    let pub = await Pub.findOne(args.pubId, {
      relations: ['mods'],
    })
    if (pub) {
      if (pub.mods.some((mod) => mod.id === context.session.userId)) {
        return await resolver({ ...parent, pub }, args, context, info)
      }
    }
  }
  throw new ForbiddenError(genericAuthError)
}
export { isLoggedInMiddleware, isPostAuthorMiddleware, isModeratorMiddleware }
