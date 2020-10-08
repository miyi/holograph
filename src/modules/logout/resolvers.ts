import { ResolverMap } from '../../types/graphql-utils'
import { AuthResponse } from '../../types/graphql'
import {
  sessionUserError,
  sessionLremError,
  createCustomSessionError,
} from '../../utils/AuthErrors'
import { removeAllUserSessions } from '../../utils/auth-utils'
import { userSessionIdPrefix } from '../../utils/constants'

export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session, redis }) => {
      let authResponse: AuthResponse = {
        success: false,
        error: [],
      }
      if (session && !session.userId) {
        authResponse.error?.push(sessionUserError)
      } else {
        let reply: number = await redis('lrem', [
          userSessionIdPrefix + session.userId,
          -1,
          session.id,
        ])
        if (reply < 1) authResponse.error?.push(sessionLremError)
      }
      return new Promise((res) =>
        session.destroy(async (err: string) => {
          if (!err) {
            authResponse.success = true
          } else {
            const authError = createCustomSessionError(err)
            authResponse.error?.push(authError)
          }
          res(authResponse)
        }),
      )
    },
    logoutAll: async (_, __, { session, redis }) => {
      let authResponse: AuthResponse = {
        success: false,
        error: [],
      }
      // let sessionId: string
      let userId: string
      if (session && session.userId) {
        userId = session.userId
        authResponse.success = await removeAllUserSessions(userId, redis)
      } else {
        authResponse.error.push(sessionUserError)
      }
      return authResponse
    },
  },
}

