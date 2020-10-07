import { ResolverMap } from '../../types/graphql-utils'
import { MutationRegisterArgs, AuthResponse } from '../../types/graphql'
import { Users } from '../../entity/Users'
import { formatYupErr } from '../../utils/formatYupError'
import { createConfirmEmailLink } from '../../utils/createLink'
import { sendConfirmationEmail } from '../../utils/sendEmail'
import { emailPasswordSchema } from '../../utils/yupValidate'
import { duplicateEmail } from '../../utils/authErrors'

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, args: MutationRegisterArgs, { redis, url }) => {
      let authResponse: AuthResponse = {
        success: false,
        error: [],
      }

      try {
        await emailPasswordSchema.validate(args, { abortEarly: false })
      } catch (err) {
        const yupError = formatYupErr(err)
        yupError.forEach((err) => authResponse.error.push(err))
        return authResponse
      }
      const { email, password } = args
      const userAlreadyExist = await Users.findOne({
        where: { email },
        select: ['id'],
      })
      if (userAlreadyExist) {
        authResponse.error.push(duplicateEmail)
        return authResponse
      }
      const user = await Users.create({
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
