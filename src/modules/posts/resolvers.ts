import { Post } from '../../entity/Post'
import { User } from '../../entity/User'
import {
  MutationCreatePostArgs,
  MutationSaveEditPostArgs,
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
import { MutationTagAndPublishPostArgs } from '../../types/graphql'
import { mockValidateTagInputArray } from '../../utils/tagUtils'

export const resolvers: ResolverMap = {
  Query: {
    getPostById: async (_, { id }: QueryGetPostByIdArgs) => {
      return await Post.findOne(id, {
        where: { removed: false },
      })
    },
    getPostsByTitle: async (_, { title }: QueryGetPostsByTitleArgs) => {
      return await Post.find({
        title: title,
        removed: false,
      })
    },
    getPostsByAuthorId: async (
      _,
      { authorId }: QueryGetPostsByAuthorIdArgs,
    ) => {
      return await Post.find({
        removed: false,
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
        { postInput }: MutationCreatePostArgs,
        { session }: GraphqlContext,
      ) => {
        const user = await User.findOne(session.userId)
        const post = await Post.create({
          title: postInput.title,
          body: postInput.body,
          author: user,
        }).save()
        return post
      },
    ),
    tagAndPublishPost: createMiddleware(
      isPostAuthorMiddleware,
      async (parent, { tags }: MutationTagAndPublishPostArgs) => {
        if (parent.post.publish) return null
        let { post } = parent.post
        if (tags) {
          const post = await Post.findOne(parent.post.id, {
            relations: ['tags'],
          })
          let validatedTags = await mockValidateTagInputArray(tags)
          post?.tags?.concat(validatedTags)
        }
        post.published = true
        await post.save()
        return post.id
      },
    ),
    removePost: createMiddleware(isPostAuthorMiddleware, async (parent, _) => {
      let { post } = parent
      post.removed = true
      await post.save()
      return true
    }),
    saveEditPost: createMiddleware(
      isPostAuthorMiddleware,
      async (parent, args: MutationSaveEditPostArgs) => {
        let { post } = parent
        if (!post.published) {
          if (args.postInput.title) post.title = args.postInput.title
        }
        if (args.postInput.body) post.body = args.postInput.body
        return await post.save()
      },
    ),
  },
  Post: {
    author: async (parent) => {
      let post = await Post.findOne(parent.id, {
        relations: ['author'],
      })
      return post?.author
    },
    isInMyCollection: createMiddleware(
      isLoggedInMiddleware,
      async (parent, _, { session }) => {
        let response = false
        console.log('triggered')
        let userWithCollection = await User.findOne({
          relations: ['collection'],
          where: {
            id: session.userId,
          },
        })
        if (userWithCollection) {
          userWithCollection.collection.forEach((post) => {
            if (post.id === parent.id) {
              response = true
            }
          })
        }
        return response
      },
    ),
    tags: async (parent) => {
      const postWithTags = await Post.findOne(parent.id, {
        relations: ['tags'],
      })
      return postWithTags?.tags
    },
  },
}
