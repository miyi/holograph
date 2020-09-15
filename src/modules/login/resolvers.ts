import { ResolverMap } from '../../types/graphql-utils'
import { MutationLoginArgs, AuthError } from '../../types/graphql'
import { emailPasswordSchema } from '../../utils/yupValidate'
import { formatYupErr } from '../../utils/formatYupError'
import { compareSync } from 'bcryptjs'
import { Users } from '../../entity/Users'
import { emailError, passwordError, confirmEmailError } from './loginErrors'
import { userSessionPrefix } from '../../utils/constants'

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (_, args: MutationLoginArgs, { session, redis }) => {
      try {
        await emailPasswordSchema.validate(args, { abortEarly: false })
      } catch (err) {
        const badInputResponse = {
          success: false,
          error: formatYupErr(err),
        }
        return badInputResponse
      }
      const { email, password } = args
      let success: boolean = false
      let error: Array<AuthError> = []
      const user = await Users.findOne({
        where: {
          email,
        },
      })
      if (!user) {
        error.push(emailError)
      } else {
        success = await compareSync(password, user.password)
        if (!success) {
          error.push(passwordError)
        } else {
          if (user.confirm === false) {
            error.push(confirmEmailError)
          }
          if (session) {
            session.userId = user.id
            await redis('lpush', [userSessionIdPrefix + user.id, session.id])
          }
        }
      }

      const loginResponse = {
        success,
        error,
      }

      return loginResponse
    },
  },
}
