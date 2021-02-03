import { testServerSetup, testTeardown } from '../../test/testSetup'
import { Server } from 'http';
import { createMockPostByUser, createMockTag, createMockUser } from '../../test/mockData';
import { TestClient } from '../../test/testClient';
import { Post } from '../../entity/Post';
import { Tag } from '../../entity/Tag';

let server: Server
let client: TestClient
let user: any
let post: any
let tag1: any

const tagThePost = async (post: Post, tag: Tag) => {
	let res = await Post.findOne(post.id, {
		relations: ['tags']
	})
	res?.tags?.push(tag)
	await res?.save()
	return true
}

beforeAll(async () => {
	server = await testServerSetup()
	client = new TestClient()
	user = await createMockUser()
	post = await createMockPostByUser(user)
	tag1 = await createMockTag()
	await tagThePost(post, tag1)
})
afterAll(async () => {
  await testTeardown(server)
})

describe('tag resolver test', () => {
	it('looks up tag via axios', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
        {
          lookUpTag(name: "${tag1.name}") {
            name
          }
        }
      `,
    })
    expect(res.data.data.lookUpTag[0]).toBeTruthy()
    res = await client.axiosInstance.post('/', {
      query: `
        {
          getTagById(id: "${tag1.id}") {
            name
            posts {
              title
              author {
                email
              }
            }
          }
        }
      `,
    })
    expect(res.data.data.getTagById.posts[0].author.email).toEqual(user.email)
    res = await client.axiosInstance.post('/', {
      query: `
        {
          getPostsByTagId(id: "${tag1.id}") {
            title
            author {
              email
            }
            tags
          }
        }
      `,
    })
    expect(res.data.data.getPostsByTagId[0].author.email).toEqual(user.email)
    expect(res.data.data.getPostsByTagId[0].tags.name).toEqual(tag1.name)
  })
})