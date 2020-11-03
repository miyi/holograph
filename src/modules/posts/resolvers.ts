import { ResolverMap, GraphqlContext } from '../../types/graphql-utils';
import { Posts } from '../../entity/posts';
import { MutationCreatePostArgs, QueryGetPostByIdArgs } from '../../types/graphql';
import { authMiddleware } from '../../utils/auth/authMiddleware';
import { createMiddleware } from '../../utils/createMiddleware';
import { Users } from '../../entity/Users';
export const resolvers: ResolverMap = {
	Query: {
		getPostById: async (_, {id}: QueryGetPostByIdArgs) => {
			return await Posts.findOne(id)
		},
		getPostsByTitle: () => {
			return null
		},
		getPostByAuthor: () => {
			return null
		},
	},
	Mutation: {
		createPost: createMiddleware(authMiddleware , async(_, {title}: MutationCreatePostArgs, {session, redis}: GraphqlContext) => {
			const user = await Users.findOne(session.userId)
			const post = await Posts.create({
				title,
				author: user
			}).save()
			return post
		}),
		publishPost: () => {
			return null
		},
		unPublishPost: () => {
			return null
		},
		saveEditPostBody: () => {
			return null
		},
	},
	Post: {
		author: async (parent) => {
			const post = await Posts.findOne(parent.id)
			return (post as Posts).author
		}
	}
}