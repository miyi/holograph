import { createQueryBuilder, Like } from 'typeorm'
import { Tag } from '../../entity/Tag'
import {
  QueryGetPostsByTagIdArgs,
  QueryLookUpTagArgs,
} from '../../types/graphql'
import { ResolverMap } from '../../types/graphql-utils'
import { transformStringToTagSearchKey } from '../../utils/tagUtils'
import { QueryGetTagByIdArgs } from '../../types/graphql'
export const resolver: ResolverMap = {
  Query: {
    lookUpTag: async (_, { name }: QueryLookUpTagArgs) => {
      let searchKey = transformStringToTagSearchKey(name)
      return await Tag.find({
        where: {searchKey: Like(`%${searchKey}%`)},
      })
    },
    getPostsByTagId: async (_, { id }: QueryGetPostsByTagIdArgs) => {
      const tag = await Tag.findOne(id, {
        relations: ['posts'],
      })
      return tag?.posts
    },
    getTagById: async (_, { id }: QueryGetTagByIdArgs) => {
      return await Tag.findOne(id)
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
