import { Tag } from '../entity/Tag'
import { TagInput } from '../types/graphql'

const transformStringToTagSearchKey = (input: string) => {
  return input.replace(/\s/g, '').toLocaleLowerCase()
}

const upsertTag = async (name: string) => {
  const searchKey = transformStringToTagSearchKey(name)
  const existingTag = await Tag.findOne({
    where: {
      searchKey,
    },
  })
  if (existingTag) return existingTag
  return Tag.create({
    name,
    searchKey,
  })
}

const mockValidateTagInputArray = async (tags: TagInput[]) => {
  const validatedTags: Tag[] = []
  await Promise.all(tags.map(async (tag) => {
    let validatedTag: Tag | undefined | null
    if (tag.id) {
      validatedTag = await Tag.findOne(tag.id)
    } else {
      validatedTag = await upsertTag(tag.name)
    }
    if(validatedTag) validatedTags.push(validatedTag)
  }))
  return validatedTags
}

export { transformStringToTagSearchKey, upsertTag, mockValidateTagInputArray }
