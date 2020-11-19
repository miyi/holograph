import { Posts } from '../../entity/Posts'
import { Users } from '../../entity/Users'
import {
  MutationCreatePostArgs,
  MutationSaveEditPostBodyArgs,
  QueryGetPostByIdArgs,
  QueryGetPostsByAuthorIdArgs,
  QueryGetPostsByTitleArgs,
} from '../../types/graphql'
import { GraphqlContext, ResolverMap } from '../../types/graphql-utils'
import {
  isLoggedInMiddleware,
  isPostAuthorMiddleware,
} from '../../utils/auth/authMiddleware'
import { createMiddleware } from '../../utils/createMiddleware'

export const resolvers: ResolverMap = {
  Query: {
    getPostById: async (
      _,
      { id }: QueryGetPostByIdArgs,
    ): Promise<Posts | undefined> => {
      return await Posts.findOne(id as string)
    },
    getPostsByTitle: async (
      _,
      { title }: QueryGetPostsByTitleArgs,
    ): Promise<Posts[] | undefined> => {
      return await Posts.find({
        title: title,
      })
    },
    getPostsByAuthorId: async (
      _,
      { authorId }: QueryGetPostsByAuthorIdArgs,
    ): Promise<Posts[] | undefined> => {
      return await Posts.find({
        author: {
          id: authorId,
        },
      })
    },
  },
  Mutation: {
    createPost: createMiddleware(
      isLoggedInMiddleware,
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
    publishPost: createMiddleware(isPostAuthorMiddleware, async (parent, _) => {
      let { post } = parent
      post.published = true
      await post.save()
      return post
    }),
    unPublishPost: createMiddleware(
      isPostAuthorMiddleware,
      async (parent, _) => {
        let { post } = parent
        post.published = false
        await post.save()
        return post
      },
    ),
    saveEditPostBody: createMiddleware(
      isPostAuthorMiddleware,
      async (parent, { body }: MutationSaveEditPostBodyArgs) => {
        let { post } = parent
        post.body = body
        await post.save()
        return post
      },
    ),
  },
  Post: {
    author: async (parent) => {
      let post = await Posts.findOne({
        relations: ['author'],
        where: {
          id: parent.id,
        },
      })
      return post?.author
    },
  },
}
