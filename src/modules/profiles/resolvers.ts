import { ResolverMap } from '../../types/graphql-utils'
import { Profile } from '../../entity/Profile'
import { createMiddleware } from '../../utils/createMiddleware'
import { isLoggedInMiddleware } from '../../utils/auth/authMiddleware'
import {
  QueryGetProfileByUserIdArgs,
  MutationAddPostToMyCollectionArgs,
} from '../../types/graphql'
import { Post } from '../../entity/Post'
import {
  MutationRemovePostFromMyCollectionArgs,
  MutationUpdateMyProfileDescriptionArgs,
} from '../../types/graphql'
export const resolvers: ResolverMap = {
  Mutation: {
    addPostToMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (_, { postId }: MutationAddPostToMyCollectionArgs, { session }) => {
        let success = false
        let profile = await Profile.findOne({
          relations: ['user', 'collection'],
          where: {
            user: {
              id: session.userId,
            },
          },
        })
        let post = await Post.findOne(postId)
        if (profile && post) {
          profile.collection.push(post)
          success = true
          await profile.save().catch((err) => {
            console.log(err.code)
            success = false
          })
        }
        return success
      },
    ),
    removePostFromMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (
        _,
        { postId }: MutationRemovePostFromMyCollectionArgs,
        { session },
      ) => {
        let success = false
        let profile = await Profile.findOne({
          relations: ['user', 'collection'],
          where: {
            user: {
              id: session.userId,
            },
          },
        })
        if (profile) {
          profile.collection = profile.collection.filter((post) => {
            post.id === postId
          })
          success = true
          await profile.save().catch(() => {
            success = false
          })
        }
        return success
      },
    ),
    updateMyProfileDescription: createMiddleware(
      isLoggedInMiddleware,
      async (
        _,
        { description }: MutationUpdateMyProfileDescriptionArgs,
        { session },
      ) => {
        let profile = await Profile.findOne({
          relations: ['user'],
          where: {
            user: {
              id: session.userId,
            },
          },
        })
        if (profile) {
          profile.description = description
          await profile.save().catch(() => {
            return null
          })
        }
        return profile
      },
    ),
  },
  Query: {
    getMyProfile: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
        return await Profile.findOne({
          relations: ['user'],
          where: {
            user: {
              id: session.userId,
            },
          },
        })
      },
    ),
    getMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
        let profile = await Profile.findOne({
          relations: ['user', 'collection'],
          where: {
            user: {
              id: session.userId,
            },
          },
        })
        if (profile?.collection) {
          return profile.collection
        } else {
          return null
        }
      },
    ),
    getProfileByUserId: async (_, { userId }: QueryGetProfileByUserIdArgs) => {
      return await Profile.findOne({
        relations: ['user'],
        where: {
          user: {
            id: userId,
          },
        },
      })
    },
  },
  Profile: {
    user: async (parent) => {
      let profile = await Profile.findOne(parent.id, {
        relations: ['user'],
      })
      if (profile) {
        return profile.user
      } else {
        return null
      }
    },
    collection: async (parent) => {
      let profile = await Profile.findOne(parent.id, {
        relations: ['collection'],
      })
      if (profile) {
        return profile.collection
      } else {
        return null
      }
    },
  },
}
