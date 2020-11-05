import { ResolverMap, GraphqlContext } from '../../types/graphql-utils'
import { Posts } from '../../entity/Posts'
import {
  MutationCreatePostArgs,
  QueryGetPostByIdArgs,
  QueryGetPostsByTitleArgs,
  QueryGetPostsByAuthorArgs,
} from '../../types/graphql'
import { authMiddleware } from '../../utils/auth/authMiddleware'
import { createMiddleware } from '../../utils/createMiddleware'
import { Users } from '../../entity/Users'
import { MutationPublishPostArgs } from '../../types/graphql'
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
    getPostsByAuthor: async (
      _,
      { authorId }: QueryGetPostsByAuthorArgs,
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
    publishPost: createMiddleware(
      authMiddleware,
      async (_, { id }: MutationPublishPostArgs, { session }) => {
        let post = await Posts.findOne({
          relations: ['author'],
          where: {
            id: id,
          },
        })
        //check if post author is the current
        if (post && post.author.id === session.userId) {
          post.published = true
          await post.save()
        }
        return post
      },
    ),
    unPublishPost: () => {
      return null
    },
    saveEditPostBody: () => {
      return null
    },
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
