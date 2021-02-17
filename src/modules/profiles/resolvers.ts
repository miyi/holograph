import { Profile } from '../../entity/Profile'
import { User } from '../../entity/User'
import {
  MutationUpdateMyProfileDescriptionArgs,
  QueryGetProfileByUserIdArgs,
} from '../../types/graphql'
import { ResolverMap } from '../../types/graphql-utils'
import { isLoggedInMiddleware } from '../../utils/auth/authMiddleware'
import { createMiddleware } from '../../utils/createMiddleware'
export const resolvers: ResolverMap = {
  Mutation: {
    updateMyProfileDescription: createMiddleware(
      isLoggedInMiddleware,
      async (
        _,
        { description }: MutationUpdateMyProfileDescriptionArgs,
        { session },
      ) => {
        let user = await User.findOne(session.userId, {
          relations: ['profile'],
        })
        if (user) {
          let profile = user.profile
          profile.description = description
          return await profile.save()
        }
        return null
      },
    ),
  },
  Query: {
    getMyProfile: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
        let user = await User.findOne(session.userId, {
          relations: ['profile'],
        })
        if (user) {
          return user.profile
        } else {
          return null
        }
      },
    ),
    getProfileByUserId: async (_, { userId }: QueryGetProfileByUserIdArgs) => {
      let user = await User.findOne(userId, {
        relations: ['profile'],
      })
      if (user) {
        return user.profile
      }
      return null
    },
  },
  Profile: {
    user: async (parent) => {
      let profile = await Profile.findOne(parent.id, {
        relations: ['user']
      })
      if (profile) {
        return profile.user
      } else {
        return null
      }
    },
  },
}
