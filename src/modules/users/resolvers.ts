import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryGetUserByIdArgs,
  QueryGetUserByEmailArgs,
} from '../../types/graphql'
import { Users } from '../../entity/Users'

export const resolvers: ResolverMap = {
  Query: {
    getUserById: async (
      _,
      { id }: QueryGetUserByIdArgs,
    ): Promise<Users | undefined> => {
      return await Users.findOne(id as string)
    },
    getUserByEmail: async (
      _,
      { email }: QueryGetUserByEmailArgs,
    ): Promise<Users | undefined> => {
      return await Users.findOne({ email: email as string })
    },
  },
  User: {
    posts: () => {
      return null
    },
  },
}
