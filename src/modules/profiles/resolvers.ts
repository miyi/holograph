import { ResolverMap } from '../../types/graphql-utils'
import { Profiles } from '../../entity/Profiles'
import { createMiddleware } from '../../utils/createMiddleware'
import { isLoggedInMiddleware } from '../../utils/auth/authMiddleware'
import { QueryGetProfileByUserIdArgs } from '../../types/graphql'
export const resolvers: ResolverMap = {
  Mutation: {
    addPostToMyCollection: () => {
      return null
    },
    removePostFromMyCollection: () => {
      return null
    },
    editMyProfileDescription: () => {
      return null
    },
  },
  Query: {
    getMyProfile: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
				console.log('resolver running');
        return await Profiles.findOne({
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
        let profile = await Profiles.findOne({
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
      return await Profiles.findOne({
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
      let profile = await Profiles.findOne(parent.id, {
        relations: ['user'],
      })
      if (profile) {
        return profile.user
      } else {
        return null
      }
    },
    collection: async (parent) => {
      let profile = await Profiles.findOne(parent.id, {
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
