import { TestClient } from '../../test/testClient'
import { Server } from 'http'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import {
  createMockPostByUser,
  createMockUser,
  mockPassword,
  createMockPostObject,
} from '../../test/mockData'

let server: Server
let client: TestClient
let user: any
let post: any
const postObj1 = createMockPostObject()
const postObj2 = createMockPostObject()

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
  post = await createMockPostByUser(user)
  await createMockPostByUser(user)
  await createMockPostByUser(user)
})

afterAll(async () => {
  await testTeardown(server)
})

describe('postCore tests', () => {
  it('getPostById test', async () => {
    let res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.isInMyCollection).toBeFalsy()
    expect(res.data.data.getPostById.title).toEqual(post.title)
    expect(res.data.data.getPostById.author.email).toEqual(user.email)
  })
  // it('typeorm gets author from post using queryBuilder', async () => {
  //   let res = await Post.createQueryBuilder('posts')
  //     .leftJoinAndSelect('posts.author', 'users')
  //     .getMany()
  //   expect(res.length).toBeGreaterThan(0)
  //   expect(res[0].id).toEqual(post.id)
  //   expect(res[0].author.id).toEqual(user.id)
  // })
  it('queries getPostByTitle', async () => {
    let res = await client.getPostsByTitle(post.title)
    expect(res.data.data.getPostsByTitle.length).toBeGreaterThan(0)
    expect(res.data.data.getPostsByTitle[0].title).toEqual(post.title)
  })
  it('queries getPostsByAuthor', async () => {
    let res = await client.getPostsByAuthorId(user.id)
    expect(res.data.data.getPostsByAuthorId.length).toBeGreaterThan(0)
    expect(res.data.data.getPostsByAuthorId[0].title).toEqual(post.title)
    expect(res.data.data.getPostsByAuthorId[0].author.email).toEqual(user.email)
  })
  it('creates post before logging in', async () => {
    let res = await client.createPost(postObj1)
    expect(res.data.data.createPost).toBeNull()
  })
  it('publish before logging in', async () => {
    let res = await client.publishPost(post.id)
    expect(res.data.data.publishPost).toBeNull()
  })
  it('creates post after logging in', async () => {
    let loginRes = await client.login(user.email, mockPassword)
    expect(loginRes.data.data.login.success).toBeTruthy()
    let res = await client.createPost(postObj2)
    expect(res.data.data.createPost.id).toBeTruthy()
    expect(res.data.data.createPost.author.email).toEqual(user.email)
  })
  it('publishes an existing post', async () => {
    let res = await client.tagAndPublishPost(post.id)
    expect(res.data.data.publishPost).toEqual(post.id)
  })
  it('remove the previously published post', async () => {
    let res = await client.removePost(post.id)
    expect(res.data.data.removePost).toBeTruthy()
  })
  it('saveEditPostBody', async () => {
    let res = await client.saveEditPost(post.id, postObj2)
    expect(res.data.data.saveEditPostBody.body).toEqual(postObj2.body)
    expect(res.data.data.saveEditPostBody.author.email).toEqual(user.email)
  })
  it('gets post then checks isInMyCollection', async () => {
    let res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.isInMyCollection).toEqual(false)
    await client.addPostToMyCollection(post.id)
    res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.isInMyCollection).toEqual(true)
  })
})
