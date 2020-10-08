import { ResolverMap } from '../../types/graphql-utils'
import { MutationLoginArgs, AuthResponse } from '../../types/graphql'
import { emailPasswordSchema } from '../../utils/yupValidate'
import { formatYupErr } from '../../utils/formatYupError'
import { compareSync } from 'bcryptjs'
import { Users } from '../../entity/Users'
import { loginUser } from '../../utils/auth-utils'
import { alreadyLoggedIn, confirmEmailError, emailError, passwordError } from '../../utils/authErrors'
// import { userSessionIdPrefix } from '../../utils/constants'

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _,
      args: MutationLoginArgs,
      { session, redis },
    ): Promise<AuthResponse> => {
      let authResponse: AuthResponse = {
        success: false,
        error: [],
      }

      if (session && session.userId) {
        //check if already logged in
        authResponse.error?.push(alreadyLoggedIn)
      } else {
        //validate email password formate
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
        //check user exist
        const user = await Users.findOne({
          where: {
            email,
          },
        })
        if (!user) {
          authResponse.error?.push(emailError)
        } else {
          //match email with password
          authResponse.success = compareSync(password, user.password as string)
          if (!authResponse.success) {
            authResponse.error?.push(passwordError)
          } else {
            //check if user if confirmed
            if (user.confirm === false) {
              authResponse.error?.push(confirmEmailError)
            }
            //write userId into session, store sessionId under userSessionIdPrefix
            authResponse.success = await loginUser(user.id, session, redis)
          }
        }
      }
      return authResponse
    },
    // login: async (_, args: MutationLoginArgs, { session, redis }) => {
    //   try {
    //     await emailPasswordSchema.validate(args, { abortEarly: false })
    //   } catch (err) {
    //     const badInputResponse = {
    //       success: false,
    //       error: formatYupErr(err),
    //     }
    //     return badInputResponse
    //   }
    //   const { email, password } = args
    //   let success: boolean = false
    //   let error: Array<AuthError> = []
    //   const user = await Users.findOne({
    //     where: {
    //       email,
    //     },
    //   })
    //   if (!user) {
    //     error.push(emailError)
    //   } else {
    //     success = await compareSync(password, user.password as string)
    //     if (!success) {
    //       error.push(passwordError)
    //     } else {
    //       if (user.confirm === false) {
    //         error.push(confirmEmailError)
    //       }
    //       if (session) {
    //         session.userId = user.id
    //         let lpushRes = await redis('lpush', [userSessionIdPrefix + user.id, session.id])
    //         console.log('lpushing session: ', session.id)
    //         console.log('lpushRes: ', lpushRes);
    //       }
    //     }
    //   }

    //   const loginResponse = {
    //     success,
    //     error,
    //   }

    //   return loginResponse
    // },
  },
}
