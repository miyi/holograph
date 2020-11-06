import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'
import { Posts } from '../../entity/Posts'
import { Server } from 'http'
import { redis } from '../../server_configs/redisServer'

let server: Server
let client: TestClient
const email = 'jim@jim.com'
const password = 'password123'
let req_url: string
let user: any
let post: Posts
const postTitle1 = 'typeorm insert'
const postTitle2 = 'create post'

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TestClient(req_url)
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
  await server.close()
  await new Promise((resolve) => {
    redis.quit(() => {
      resolve()
    })
  })
})

describe('postCore tests', () => {
  it('creates user and post', async () => {
    user = await Users.create({
      email,
      password,
    }).save()
    expect(user.id).not.toBeNull()
    post = await Posts.create({
      title: postTitle1,
      author: user,
    }).save()
    expect(post.id).not.toBeNull()
  })
  it('getPostById test', async () => {
    let res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.title).toEqual(postTitle1)
  })
  it('getPostFromId plus author email chain', async () => {
    let res = await client.getPostByIdPlusAuthor(post.id)
    expect(res.data.data.getPostById.author.email).toEqual(email)
  })
  it('typeorm gets author from post', async () => {
    let res = await Posts.findOne({
      relations: ['author'],
      where: {
        id: post.id,
      },
    })
    expect(res?.author.id).toEqual(user.id)
  })
  it('typeorm gets author from post using queryBuilder', async () => {
    let res = await Posts.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'users')
      .getMany()
    expect(res.length).toBeGreaterThan(0)
    expect(res[0].id).toEqual(post.id)
    expect(res[0].author.id).toEqual(user.id)
  })
  it('queries getPostByTitle', async () => {
    let res = await client.getPostsByTitle(postTitle1)
    expect(res.data.data.getPostsByTitle.length).toBeGreaterThan(0)
    expect(res.data.data.getPostsByTitle[0].title).toEqual(postTitle1)
  })
  it('queries getPostByAuthor', async () => {
    let res = await client.getPostsByAuthor(user.id)
    expect(res.data.data.getPostsByAuthor.length).toBeGreaterThan(0)
    expect(res.data.data.getPostsByAuthor[0].title).toEqual(postTitle1)
    expect(res.data.data.getPostsByAuthor[0].author.email).toEqual(email)
  })
  it('creates post while not logged in', async () => {
    let res = await client.createPost(postTitle2)
    expect(res.data.data.createPost).toBeNull()
  })
  it('creates post after logging in', async () => {
    let loginRes = await client.login(email, password)
    expect(loginRes.data.data.login.success).toBeTruthy()
    let res = await client.createPost(postTitle2)
    expect(res.data.data.createPost.id).toBeTruthy()
    expect(res.data.data.createPost.author.email).toEqual(email)
  })
  it('publishes an existing post', async () => {
    let res = await client.publishPost(post.id)
		expect(res.data.data.publishPost.author.email).toEqual(email)
		expect(res.data.data.publishPost.published).toBeTruthy()
	})
	it('unPublishes the previously published post', async () => {
		let res = await client.unPublishPost(post.id)
		expect(res.data.data.unPublishPost.published).toBeFalsy()
		expect(res.data.data.unPublishPost.author.email).toEqual(email)
	})
})
