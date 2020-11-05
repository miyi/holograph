import { ResolverMap, GraphqlContext } from '../../types/graphql-utils';
import { Posts } from '../../entity/posts';
import { MutationCreatePostArgs, QueryGetPostByIdArgs, QueryGetPostsByTitleArgs, QueryGetPostsByAuthorArgs } from '../../types/graphql';
import { authMiddleware } from '../../utils/auth/authMiddleware';
import { createMiddleware } from '../../utils/createMiddleware';
import { Users } from '../../entity/Users';
export const resolvers: ResolverMap = {
	Query: {
		getPostById: async (_, {id}: QueryGetPostByIdArgs) => {
			console.log('running with id: ', id);
			return await Posts.findOne(id)
		},
		getPostsByTitle: async ({title}: QueryGetPostsByTitleArgs) => {
			return await Posts.find({
				title,
			})		
		},
		getPostsByAuthor: async ({authorId}: QueryGetPostsByAuthorArgs) => {
			return await Posts.find({
				where: {
					author: {
						id: authorId
					}
				}
			})
		},
	},
	Mutation: {
		createPost: createMiddleware(authMiddleware , async(_, {title}: MutationCreatePostArgs, {session}: GraphqlContext) => {
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