import { ResolverMap } from '../../types/graphql-utils'
import { Profiles } from '../../entity/Profiles';
import { createMiddleware } from '../../utils/createMiddleware'
import { isLoggedInMiddleware } from '../../utils/auth/authMiddleware'
import { Users } from '../../entity/Users';
import { QueryGetUserProfileArgs } from '../../types/graphql';
export const resolvers: ResolverMap = {
  Mutation: {},
  Query: {
    getMyProfile: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
				let user = await Users.findOne(session.userId, {
					relations: ['profile']
				})
				return user?.profile
			},
		),
		getMyCollection: createMiddleware(
			isLoggedInMiddleware,
			async (_, __, {session}) => {
				let profile = await Profiles.findOne({
					relations: ['user', 'collection'],
					where: {
						user: {
							id: session.userId
						}
					}
				})
				if (profile?.collection) {return profile.collection} else {return null}
			}
		),
		getUserProfile: async (_, { userId } : QueryGetUserProfileArgs ) => {
			let res = await Users.findOne(userId, {
				relations: ['profile']
			})
			if (res?.profile) {
				return res.profile
			} else {
				return null
			}
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
				relations: ['collection']
			})
			if (profile) {
				return profile.collection
			} else {
				return null
			}
		}
  },
}
