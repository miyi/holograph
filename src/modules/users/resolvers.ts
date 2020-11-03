import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryGetUserByIdArgs,
  QueryGetUserByEmailArgs,
} from '../../types/graphql'
import { Users } from '../../entity/Users'
import { emailValidateSchema } from '../../utils/yupValidate'

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
  Mutation: {
    updateUserEmail: async (_, { email }, { session }): Promise<boolean> => {
      let success = false
      emailValidateSchema.validate(email).catch(() => {
        console.log('bad email');
        return success
      })
      if (session && session.userId) {
        let user = await Users.findOne(session.userId)
        if (user) {
          user.email = email
          await Users.save(user)
          success = true
        }
      }
      return success
    },
  },
  User: {
    posts: () => {
      return null
    },
  },
}
