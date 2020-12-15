import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryGetUserByIdArgs,
  QueryGetUserByEmailArgs,
} from '../../types/graphql'
import { User } from '../../entity/User'
import { emailValidateSchema } from '../../utils/yupValidate'
import { Post } from '../../entity/Post'

export const resolvers: ResolverMap = {
  Query: {
    getUserById: async (
      _,
      { id }: QueryGetUserByIdArgs,
    ): Promise<User | undefined> => {
      return await User.findOne(id as string)
    },
    getUserByEmail: async (
      _,
      { email }: QueryGetUserByEmailArgs,
    ): Promise<User | undefined> => {
      return await User.findOne({ email: email as string })
    },
  },
  Mutation: {
    updateUserEmail: async (_, { email }, { session }): Promise<boolean> => {
      let success = false
      emailValidateSchema.validate(email).catch(() => {
        console.log('bad email')
        return success
      })
      if (session && session.userId) {
        let user = await User.findOne(session.userId)
        if (user) {
          user.email = email
          await User.save(user)
          success = true
        }
      }
      return success
    },
  },
  User: {
    posts: async (parent) => {
      return await Post.find({
        author: {
          id: parent.id,
        },
      })
    },
  },
}
