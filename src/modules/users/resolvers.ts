import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryGetUserByIdArgs,
  QueryGetUserByEmailArgs,
  MutationAddPostToMyCollectionArgs,
} from '../../types/graphql'
import { User } from '../../entity/User'
import { emailValidateSchema } from '../../utils/yupValidate'
import { Post } from '../../entity/Post'
import { createMiddleware } from '../../utils/createMiddleware'
import { isLoggedInMiddleware } from '../../utils/auth/authMiddleware'
import { QueryGetCollectionFromUserArgs } from '../../types/graphql'

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
    getMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
        let userWithCollection = await User.findOne({
          relations: ['collection'],
          where: {
            id: session.userId,
          },
        })
        if (userWithCollection) {
          return userWithCollection.collection
        } else {
          return null
        }
      },
    ),
    getCollectionFromUser: createMiddleware(
      isLoggedInMiddleware,
      async (_, { userId }: QueryGetCollectionFromUserArgs) => {
        let userWithCollection = await User.findOne({
          relations: ['collection'],
          where: {
            id: userId,
          },
        })
        if (userWithCollection) {
          return userWithCollection.collection
        } else {
          return null
        }
      },
    ),
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
    addPostToMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (_, { postId }: MutationAddPostToMyCollectionArgs, { session }) => {
        let success = false
        let post = await Post.findOne(postId)
        let userWithCollection = await User.findOne({
          relations: ['collection'],
          where: {
            id: session.userId,
          },
        })
        if (post && userWithCollection) {
          // userWithCollection.collection = userWithCollection.collection.filter((post) => {
          //   post.id !== postId
          // })
          userWithCollection.collection.push(post)
          await userWithCollection.save()
          success = true
        }
        return success
      },
    ),
    removePostFromMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (_, { postId }: MutationAddPostToMyCollectionArgs, { session }) => {
        let success = false
        let post = await Post.findOne(postId)
        let userWithCollection = await User.findOne({
          relations: ['collection'],
          where: {
            id: session.userId,
          },
        })
        if (post && userWithCollection) {
          userWithCollection.collection = userWithCollection.collection.filter(
            (post) => post.id !== postId,
          )
          await userWithCollection.save()
          success = true
        }
        return success
      },
    ),
  },
  User: {
    posts: async (parent) => {
      return await Post.find({
        author: {
          id: parent.id,
        },
      })
    },
    collection: async (parent) => {
      let userWithCollection = await User.findOne({
        relations: ['collection'],
        where: {
          id: parent.id,
        },
      })
      if (userWithCollection) return userWithCollection.collection
      return null
    },
  },
}
