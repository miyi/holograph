import { GraphqlContext } from './../../types/graphql-utils'
import { forgotPasswordPrefix } from '../../utils/constants'
import {
  AuthResponse,
  MutationForgotPasswordChangeArgs,
  MutationSendForgotPasswordEmailArgs,
} from '../../types/graphql'
import { ResolverMap } from '../../types/graphql-utils'
import { Users } from '../../entity/User'
import { sessionUserError } from '../../utils/auth/AuthErrors'
import {
  passwordValidateSchema,
  emailValidateSchema,
} from '../../utils/yupValidate'
import { formatYupErr } from '../../utils/formatYupError'
import { hashSync } from 'bcryptjs'
import { removeAllUserSessions } from '../../utils/auth/auth-utils'
import { sendForgotPasswordEmail } from '../../utils/sendEmail'
import { createForgotPasswordLink } from '../../utils/createLink'

let authResponse: AuthResponse

export const resolvers: ResolverMap = {
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: MutationSendForgotPasswordEmailArgs,
      { url, redis }: GraphqlContext,
    ): Promise<AuthResponse> => {
      authResponse = {
        success: false,
        error: [],
      }
      let user: Users | undefined
      let forgotPasswordLink: string
      let linkId: string
      //1. validate email to check if user exist
      try {
        await emailValidateSchema.validate(email, { abortEarly: false })
      } catch (err) {
        const yupError = formatYupErr(err)
        yupError.forEach((err) => {
          authResponse.error.push(err)
        })
        return authResponse
      }
      user = await Users.findOne({ where: { email } })
      if (user) {
        //2. send email with link to change Password with a linkId
        forgotPasswordLink = await createForgotPasswordLink(url, user.id, redis)
        sendForgotPasswordEmail(email, forgotPasswordLink)
        //3. store linkId and userId under forgotPasswordPrefix
        let parts = forgotPasswordLink.split('/')
        linkId = parts[parts.length - 1]
        const res: number = await redis('set', [
          forgotPasswordPrefix + linkId,
          user.id,
        ])
        if (res > 0) authResponse.success = true
        //4. logout all sessions under the userId
        await removeAllUserSessions(user.id, redis)
      }
      //5. return AuthResponse
      return authResponse
    },
    forgotPasswordChange: async (
      _,
      { linkId, newPassword }: MutationForgotPasswordChangeArgs,
      { redis },
    ): Promise<AuthResponse> => {
      authResponse = {
        success: false,
        error: [],
      }
      //1. find userId from linkId under forgotPasswordPrefix
      const userId = await redis('get', [forgotPasswordPrefix + linkId])
      const userBeforePasswordChange: Users | undefined = await Users.findOne(
        userId,
      )
      //2. validate password + use Bcryptjs to update the password
      if (userId && userBeforePasswordChange) {
        try {
          await passwordValidateSchema.validate(newPassword, {
            abortEarly: false,
          })
        } catch (err) {
          const yupError = formatYupErr(err)
          yupError.forEach((err) => {
            authResponse.error.push(err)
          })
          return authResponse
        }
        const hashedNewPassword = hashSync(newPassword, 12)
        userBeforePasswordChange.password = hashedNewPassword
        userBeforePasswordChange.save()
        authResponse.success = true
      } else {
        authResponse.error.push(sessionUserError)
      }
      //3. logout all sessions under the userId
      await removeAllUserSessions(userId, redis)
      //4. return AuthResponse
      return authResponse
    },
  },
}
