import { ResolverMap } from '../../types/graphql-utils'
import { Users } from '../../entity/Users'
import middleware from './middleware'
import { createMiddleware } from '../../utils/createMiddleware';

export const resolver: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, async (_, __, { session }, ___) => {
      const user = await Users.findOne({
        where: {
          id: session.userId,
        },
      })
      console.log('me session: ', session)
      console.log('me session id: ', session.userId)
      return user
    }),
  },
}
