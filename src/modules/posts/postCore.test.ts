import { User } from '../../entity/User'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'
import { Post } from '../../entity/Post'
import { Server } from 'http'
import { redis } from '../../server_configs/redisServer'

let server: Server
let client: TestClient
const email = 'jim@jim.com'
const password = 'password123'
let req_url: string
let user: any
let post: Post
const postTitle1 = 'typeorm insert'
const postTitle2 = 'create post'
const postBody = 'bodybody'

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
  server.close()
  await new Promise((resolve) => {
    redis.quit(() => {
      resolve(true)
    })
  })
})

describe('postCore tests', () => {
  it('creates user and post', async () => {
    user = await User.create({
      email,
      password,
    }).save()
    expect(user.id).not.toBeNull()
    post = await Post.create({
      title: postTitle1,
      author: user,
    }).save()
    expect(post.id).not.toBeNull()
  })
  it('getPostById test', async () => {
    let res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.isInMyCollection).toBeFalsy()
    expect(res.data.data.getPostById.title).toEqual(postTitle1)
    expect(res.data.data.getPostById.author.email).toEqual(email)
  })
  it('typeorm gets author from post', async () => {
    let res = await Post.findOne({
      relations: ['author'],
      where: {
        id: post.id,
      },
    })
    expect(res?.author.id).toEqual(user.id)
  })
  it('typeorm gets author from post using queryBuilder', async () => {
    let res = await Post.createQueryBuilder('posts')
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
  it('queries getPostsByAuthor', async () => {
    let res = await client.getPostsByAuthorId(user.id)
    expect(res.data.data.getPostsByAuthorId.length).toBeGreaterThan(0)
    expect(res.data.data.getPostsByAuthorId[0].title).toEqual(postTitle1)
    expect(res.data.data.getPostsByAuthorId[0].author.email).toEqual(email)
  })
  it('creates post before logging in', async () => {
    let res = await client.createPost(postTitle2)
    expect(res.data.data.createPost).toBeNull()
  })
  it('publish before logging in', async () => {
    let res = await client.publishPost(post.id)
    expect(res.data.data.publishPost).toBeNull()
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
  it('saveEditPostBody', async () => {
    let res = await client.saveEditPostBody(post.id, postBody)
    expect(res.data.data.saveEditPostBody.body).toEqual(postBody)
    expect(res.data.data.saveEditPostBody.author.email).toEqual(email)
  })
  it('gets post then checks isInMyCollection', async () => {
    let res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.isInMyCollection).toEqual(false)
    await client.addPostToMyCollection(post.id)
    res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.isInMyCollection).toEqual(true)
  })
})
