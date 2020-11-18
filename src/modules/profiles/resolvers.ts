import { ResolverMap } from '../../types/graphql-utils'
import { Profiles } from '../../entity/Profiles';
import { createMiddleware } from '../../utils/createMiddleware'
import { isLoggedInMiddleware } from '../../utils/auth/authMiddleware'
import { QueryGetUserProfileByUserIdArgs } from '../../types/graphql';
export const resolvers: ResolverMap = {
  Mutation: {},
  Query: {
    getMyProfile: createMiddleware(
      isLoggedInMiddleware,
      async (_, __, { session }) => {
				return await Profiles.findOne({
					relations: ['users'],
					where: {
						user: {
							id: session.userId
						}
					}
				})
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
		getUserProfileByUserId: async (_, { userId } : QueryGetUserProfileByUserIdArgs ) => {
			return await Profiles.findOne({
				relations: ['users'],
				where: {
					user: {
						id: userId
					}
				}
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
