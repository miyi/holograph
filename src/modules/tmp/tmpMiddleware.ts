import { Resolver } from "../../types/graphql-utils";

const timesTwoMiddleware = (
	resolver: Resolver,
	parent: any,
	args: any,
	context: any,
	info: any,
) => {
	if (!args.num) return null
	args.num = args.num * 2
	return resolver(parent, args, context, info)
}

export { timesTwoMiddleware }