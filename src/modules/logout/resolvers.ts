import { ResolverMap } from '../../types/graphql-utils'
import { AuthResponse, AuthError } from '../../types/graphql'

let logoutRes: AuthResponse
let authError: AuthError

export const resolvers: ResolverMap = {
	Mutation: {
		logout: (_, __, { session }) => {
			let error: Array<AuthError> = []
			let success: boolean = false
			if (!session.userId) {
				authError = {
					path: 'session',
					message: 'no user found',
				}
			}
			return new Promise((res) => session.destroy((err: string) => {
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