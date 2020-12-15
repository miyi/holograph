import { ResolverMap } from '../../types/graphql-utils'
import { User } from '../../entity/User'
import middleware from './middleware'
import { createMiddleware } from '../../utils/createMiddleware'

export const resolver: ResolverMap = {
  //query returns null when session.userId not found
  Query: {
    me: createMiddleware(middleware, async (_, __, { session }, ___) => {
      if (session && session.userId) {
        const user = await User.findOne({
          where: {
            id: session.userId,
          },
        })
        if (user) {
          session.touch()
          return {
            id: user.id,
            email: user.email,
          }
        } else {
          return null
        }
      } else {
        return null
      }
    }),
  },
}
