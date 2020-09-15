import { ResolverMap } from '../../types/graphql-utils'
import { AuthResponse, AuthError } from '../../types/graphql'
import { sessionUserError, sessionLremError, createCustomSessionError } from '../../utils/AuthErrors'
import { removeAllUserSessions } from '../../utils/auth-utils';

let logoutRes: AuthResponse
let authError: AuthError

export const resolvers: ResolverMap = {
	Mutation: {
		logout: async (_, __, { session, redis }) => {
			let error: Array<AuthError> = []
			let success: boolean = false
			if (session && !session.userId) {
				error.push(sessionUserError)
			} else {
				let reply: number = await redis('lrem', [session.userId, -1, session.id])
				if (reply < 1) error.push(sessionLremError)
			}
			return new Promise((res) => session.destroy(async (err: string) => {
				if (!err) {
					success = true
				} else {
					authError = createCustomSessionError(err)
					error.push(authError)
				}
				logoutRes = {
					success,
					error
				}
				res(logoutRes)
			}))
		},
		logoutAll: async (_, __, {session, redis}) => {
			let error: Array<AuthError> = []
			let success: boolean = false
			// let sessionId: string
			let userId: string
			if (session && session.userId) {
				userId = session.userId
				success = await removeAllUserSessions(userId, redis)
			} else {
				error.push(sessionUserError)
			}
			return {
				success,
				error
			}
		}
	}
}