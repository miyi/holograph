import { ResolverMap } from '../../types/graphql-utils'
import { MutationRegisterArgs } from '../../types/graphql'
import { Users } from '../../entity/Users'

import { formatYupErr } from '../../utils/formatYupError'
import { duplicateEmail } from './errorMessages'
import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink'
import { sendEmail } from '../../utils/sendEmail'
import { emailPasswordSchema } from '../../utils/yupValidate'

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, args: MutationRegisterArgs, { redis, url }) => {
      try {
        await emailPasswordSchema.validate(args, { abortEarly: false })
      } catch (err) {
        return formatYupErr(err)
      }
      const { email, password } = args
      const userAlreadyExist = await Users.findOne({
        where: { email },
        select: ['id'],
      })
      if (userAlreadyExist) {
        return [
          {
            path: 'email',
            message: duplicateEmail,
          },
        ]
      }

      const user = await Users.create({
        email,
        password,
      }).save()

      if (process.env.TEST_HOST) {
        await createConfirmEmailLink(url, user.id, redis)
      } else {
        const link = await createConfirmEmailLink(url, user.id, redis)
        await sendEmail(user.email, link)
      }
      return null
    },
  },
}
