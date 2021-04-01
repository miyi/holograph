import { ResolverMap } from '../../types/graphql-utils'
import { MutationRegisterArgs, AuthResponse } from '../../types/graphql'
import { User } from '../../entity/User'
import { formatYupErr } from '../../utils/formatYupError'
import { createConfirmEmailLink } from '../../utils/createLink'
import { sendConfirmationEmail } from '../../utils/sendEmail'
import { emailPasswordSchema } from '../../utils/yupValidate'
import { alreadyLoggedIn, duplicateEmail } from '../../utils/errorMessage/AuthErrors'
import { verifyLogin } from '../../models/auth/auth-utils'
import { asyncRedis } from '../../server_configs/redisServer'

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, args: MutationRegisterArgs, { session, redis, url }) => {
      let authResponse: AuthResponse = {
        success: false,
        error: [],
      }
      //check if a legit user is already logged in
      if (session.userId) {
        const isLoggedIn = await verifyLogin(session, asyncRedis)
        if(isLoggedIn) {
          authResponse.success = false
          authResponse.error.push(alreadyLoggedIn) 
          return authResponse
        }
      }
      //not currently logged in
      try {
        await emailPasswordSchema.validate(args, { abortEarly: false })
      } catch (err) {
        const yupError = formatYupErr(err)
        yupError.forEach((err) => authResponse.error.push(err))
        return authResponse
      }
      const { email, password } = args
      const userAlreadyExist = await User.findOne({
        where: { email },
        select: ['id'],
      })
      if (userAlreadyExist) {
        authResponse.error.push(duplicateEmail)
        return authResponse
      }
      const user = await User.create({
        email,
        password,
      }).save()

      authResponse.success = true

      if (process.env.TEST_HOST) {
        await createConfirmEmailLink(url, user.id, redis)
      } else {
        const link = await createConfirmEmailLink(url, user.id, redis)
        await sendConfirmationEmail(user.email, link)
      }
      return authResponse
    },
  },
}
