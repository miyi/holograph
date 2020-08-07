import { ResolverMap } from '../../types/graphql-utils'
import { AuthResponse, AuthError } from '../../types/graphql'

let logoutRes: AuthResponse
let authError: AuthError

export const resolvers: ResolverMap = {
	Mutation: {
		logout: async (_, __, { session, redis }) => {
			let error: Array<AuthError> = []
			let success: boolean = false
			let sessionId: string
			let userId: string
			if (session && !session.userId) {
				authError = {
					path: 'session',
					message: 'no user found',
				}
				error.push(authError)
			} else {
				sessionId = session.id
				userId = session.userId
				let rep: string = await redis('lrem', [userId, -1, sessionId])
				console.log(rep);
			}
			return new Promise((res) => session.destroy(async (err: string) => {
				if (!err) {
					success = true
				} else {
					authError = {
						path: 'session',
						message: err,
					}
					error.push(authError)
				}
				logoutRes = {
					success,
					error
				}
				res(logoutRes)
			}))
		}
	}
}