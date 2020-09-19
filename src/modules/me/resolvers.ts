import { ResolverMap } from '../../types/graphql-utils'
import { Users } from '../../entity/Users'
import middleware from './middleware'
import { createMiddleware } from '../../utils/createMiddleware';

export const resolver: ResolverMap = {
  //query returns null when session.userId not found
  Query: {
    me: createMiddleware(middleware, async (_, __, { session }, ___) => {
      if (session && session.userId) {
        const user = await Users.findOne({
          where: {
            id: session.userId,
          },
        })
        return user
      } else {
        return null
      }
    }),
  },
}
