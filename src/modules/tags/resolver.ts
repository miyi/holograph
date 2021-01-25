import { createQueryBuilder, Like } from 'typeorm'
import { Tag } from '../../entity/Tag'
import {
  QueryFindPostsByTagIdArgs,
  QueryLookUpTagArgs,
} from '../../types/graphql'
import { ResolverMap } from '../../types/graphql-utils'
import { transformStringToTagSearchKey } from '../../utils/tagUtils'
export const resolver: ResolverMap = {
  Query: {
    lookUpTag: async (_, { input }: QueryLookUpTagArgs) => {
      if (!input) return null
      input = transformStringToTagSearchKey(input)
      return await Tag.find({
        name: Like(`%${input}%`),
      })
    },
    findPostsByTagId: async (_, { tagId }: QueryFindPostsByTagIdArgs) => {
      const tag = await Tag.findOne(tagId, {
				relations: ['posts'],
				
      })
      return tag?.posts
    },
  },
  Tag: {
    posts: async (parent) => {
      const tagWithPosts = await Tag.findOne(parent.id, {
        relations: ['posts'],
      })
      return tagWithPosts?.posts
    },
    count: async (parent) => {
      const tagWithCount = await createQueryBuilder(Tag, 'tag')
        .loadRelationCountAndMap('tag.count', 'tag.posts')
        .where({ id: parent.id })
        .getOne()
      return tagWithCount?.count
    },
  },
}
