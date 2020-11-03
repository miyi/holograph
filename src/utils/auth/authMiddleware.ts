import { Resolver, GraphqlContext } from '../../types/graphql-utils';
import { verifyLogin } from './auth-utils';

export const authMiddleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: GraphqlContext,
  info: any,
) => {
	// middleware
	let result = null
	const isLoggedIn = await verifyLogin(context.session, context.redis)
	if (isLoggedIn) {
		result = await resolver(parent, args, context, info)
	} 
  // afterware
  return result
}