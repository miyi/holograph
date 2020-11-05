import { ResolverMap, GraphqlContext } from '../../types/graphql-utils'
import { Posts } from '../../entity/posts'
import {
  MutationCreatePostArgs,
  QueryGetPostByIdArgs,
  QueryGetPostsByTitleArgs,
  QueryGetPostsByAuthorArgs,
} from '../../types/graphql'
import { authMiddleware } from '../../utils/auth/authMiddleware'
import { createMiddleware } from '../../utils/createMiddleware'
import { Users } from '../../entity/Users'
export const resolvers: ResolverMap = {
  Query: {
    getPostById: async (
      _,
      { id }: QueryGetPostByIdArgs,
    ): Promise<Posts | undefined> => {
      return await Posts.findOne(id as string)
    },
    getPostsByTitle: async ({
      title,
    }: QueryGetPostsByTitleArgs): Promise<Posts[] | undefined> => {
      return await Posts.find({
        title,
      })
    },
    getPostsByAuthor: async ({
      authorId,
    }: QueryGetPostsByAuthorArgs): Promise<Posts[] | undefined> => {
      return await Posts.find({
        author: {
          id: authorId,
        },
      })
    },
  },
  Mutation: {
    createPost: createMiddleware(
      authMiddleware,
      async (
        _,
        { title }: MutationCreatePostArgs,
        { session }: GraphqlContext,
      ) => {
        const user = await Users.findOne(session.userId)
        const post = await Posts.create({
          title,
          author: user,
        }).save()
        return post
      },
    ),
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
    },
  },
}
