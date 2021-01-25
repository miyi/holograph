import { Tag } from '../entity/Tag'
import { tagNameSchema } from './yupValidate'
import { TagInput } from '../types/graphql';

const transformStringToTagSearchKey = (input: string) => {
  return input.replace(/\s/g, '').toLocaleLowerCase()
}

const upsertTag = async (name: string) => {
  try {
    tagNameSchema.validate(name, { abortEarly: false })
  } catch (err) {
    return undefined
  }
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
	tags = tags.slice(0,8)
  tags.forEach(async ({id, name}) => {
		let tag: Tag | null | undefined
    if (id) {
			tag = await Tag.findOne(id)	
		} else if (name) {
			tag = await upsertTag(name)
		}
		if (tag) validatedTags.push(tag)
  })
  return validatedTags
}

export { transformStringToTagSearchKey, upsertTag, mockValidateTagInputArray }
