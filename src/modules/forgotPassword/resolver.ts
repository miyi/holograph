// import { ResolverMap } from '../../types/graphql-utils';
// import { MutationSendForgotPasswordEmailArgs, MutationForgotPasswordChangeArgs, AuthResponse } from '../../types/graphql';

import { forgotPasswordPrefix } from "../../utils/constants"
import { AuthResponse, MutationForgotPasswordChangeArgs } from "../../types/graphql"
import { ResolverMap } from "../../types/graphql-utils"
import { Users } from '../../entity/Users';
import { sessionUserError } from "../../utils/authErrors";
import { passwordValidateSchema } from "../../utils/yupValidate";
import { formatYupErr } from "../../utils/formatYupError";
import { hashSync } from "bcryptjs";
import { removeAllUserSessions } from "../../utils/auth-utils";

export const resolver: ResolverMap = {
	Mutation: {
		// sendForgotPasswordEmail: (_, { email }: MutationSendForgotPasswordEmailArgs, { redis }) => {
		// 	//1. validate email to check if user exist
		// 	//2. send email with link to change Password with a linkId
		// 	//3. store linkId and userId under forgotPasswordPrefix
		// 	//4. logout all sessions under the userId
		// 	//5. return AuthResponse
		// },
		forgotPasswordChange: async (_, {linkId, newPassword}: MutationForgotPasswordChangeArgs, { redis }): Promise<AuthResponse> => {
			const authResponse: AuthResponse = {
				success : false,
				error: []
			}
			//1. find userId from linkId under forgotPasswordPrefix
			const userId = await redis('get', [forgotPasswordPrefix + linkId])
			const userBeforePasswordChange: Users | undefined = await Users.findOne(userId)
			//2. validate password + use Bcryptjs to update the password
			if (userId && userBeforePasswordChange) {
				try {
					await passwordValidateSchema.validate(newPassword, { abortEarly: false })
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
		}
	}
}