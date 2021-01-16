import { Server } from 'http'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import { Tag } from '../../entity/Tag';
import { createMockPostByUser, createMockUser } from '../../test/mockData'
import { Post } from '../../entity/Post'
let server: Server
let tag1: Tag
let tag2: Tag
let user: any
let postWithoutTag: any
let postWithTag: any

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
    postWithTag = await Post.create({
      title: 'first post with tag',
      author: user,
      tags: [tag1, tag2],
    }).save()
    expect(postWithTag.tags.length).toEqual(2)
  })
  it('creates post2 where tag is directly inserted', async () => {
    let tag3 = Tag.create({
      name: 'tag3',
    })
    // let tag4 = Tag.create({
    // 	name: 'tag4'
    // })
    const post2WithTag = await Post.create({
      title: 'second post with tag',
      author: user,
      tags: [tag3, tag1, { name: 'tag4' }],
    }).save()
    expect(post2WithTag?.tags?.length).toEqual(3)
  })
  it('check if proper tag creation', async () => {
    const allTags = await Tag.find()
    expect(allTags.length).toEqual(4)
  })
  it('pushes new tag to post with existing tag', async () => {
    let post = await Post.findOne(postWithTag.id, {
      relations: ['tags'],
		})
		let newTag = Tag.create({
			name: 'new tag'
		})
		post?.tags?.push(newTag)
		post = await post?.save()
		console.log(post);
  })
})
