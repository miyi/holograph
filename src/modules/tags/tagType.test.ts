import { Server } from 'http'
import { createQueryBuilder } from 'typeorm'
import { Post } from '../../entity/Post'
import { Tag } from '../../entity/Tag'
import { createMockPostByUser, createMockUser } from '../../test/mockData'
import { testServerSetup, testTeardown } from '../../test/testSetup'
let server: Server
let tag1: Tag
let tag2: Tag
let tag3: Tag
let user: any
let postWithoutTag: any
let postWithTag: any
let postWithTag12: any
let postWithTag125: any

beforeAll(async () => {
  server = await testServerSetup()
})
afterAll(async () => {
  await testTeardown(server)
})

describe('tag entity typeorm tests', () => {
  it('creates a tag object', async () => {
    tag1 = await Tag.create({
      name: 'first tag',
    }).save()
    tag2 = await Tag.create({
      name: 'second tag',
    }).save()
    expect(tag1 && tag2).toBeTruthy()
  })
  it('create user, create post with tag', async () => {
    user = await createMockUser()
    postWithoutTag = await createMockPostByUser(user)
    expect(postWithoutTag).toBeTruthy()
    postWithTag12 = await Post.findOne(postWithoutTag.id, {
      relations: ['tags'],
    })
    postWithTag12?.tags?.push(tag1, tag2)
    postWithTag12 = await postWithTag12?.save()
    expect(postWithTag12?.tags?.length).toEqual(2)
  })
  it('creates post2 where tag is directly inserted', async () => {
    tag3 = Tag.create({
      name: 'tag3',
    })
    postWithTag = await Post.create({
      title: 'second post with tag',
      author: user,
      tags: [tag3, { id: tag1.id }, { name: '栏目4' }],
    }).save()
    expect(postWithTag?.tags?.length).toEqual(3)
  })
  it('check for proper tag creation', async () => {
    const allTags = await Tag.find()
    console.log(allTags)
    expect(allTags.length).toEqual(4)
    postWithTag = await Post.findOne(postWithTag.id, {
      relations: ['tags'],
    })
    console.log(postWithTag.tags)
  })
  it('check count for tag1', async () => {
    const tag = await createQueryBuilder(Tag, 'tag')
      .loadRelationCountAndMap('tag.count', 'tag.posts')
      .where({ id: tag1.id })
      .getOne()
    expect(tag?.count).toEqual(2)
  })
  it('creates post first, then link a new and old', async () => {
    const tag5 = Tag.create({ name: 'tag5' })
    postWithTag12.tags.push(tag1, tag5)
    await postWithTag12.save()
    postWithTag125 = await Post.findOne(postWithTag12.id, {
      relations: ['tags'],
    })
    console.log(postWithTag125?.tags)
  })
})
