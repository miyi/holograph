import { Server } from 'http'
import { Post } from '../../entity/Post'
import { User } from '../../entity/User'
import {
  createMockPostByUser,
  createMockUser,
  mockPassword,
} from '../../test/mockData'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'

let server: Server
let client: TestClient
const newEmail = 'ming@ming.ca'

let user: User
let post: Post
let post2: Post

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
  post = await createMockPostByUser(user)
  post2 = await createMockPostByUser(user)
})

afterAll(async () => {
  await testTeardown(server)
})

describe('getUser tests', () => {
  it('logging in', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('getUserById', async () => {
    let res = await client.getUserById(user.id)
    expect(res.data.data.getUserById.email).toEqual(user.email)
  })
  it('getUserByEmail', async () => {
    let res = await client.getUserByEmail(user.email)
    expect(res.data.data.getUserByEmail.id).toEqual(user.id)
  })
  it('updates user email', async () => {
    let res = await client.updateUserEmail(newEmail)
    expect(res.data.data.updateUserEmail).toBeTruthy()
  })
  it('chain queries user and posts', async () => {
    let res = await client.seeUserPostFromUserId(user.id)
    expect(res.data.data.getUserById.posts.length).toBeGreaterThan(0)
    expect(res.data.data.getUserById.posts[0].id).toEqual(post.id)
  })
  it('adds 2 posts to collection', async () => {
    let res = await client.addPostToMyCollection(post.id)
    expect(res.data.data.addPostToMyCollection).toBeTruthy()
    res = await client.addPostToMyCollection(post2.id)
    expect(res.data.data.addPostToMyCollection).toBeTruthy()
  })
  it('gets my collection', async () => {
    let res = await client.getMyCollection()
    expect(res.data.data.getMyCollection.length).toEqual(2)
  })
  it('repeat adds a post, then check collection', async () => {
    await client.addPostToMyCollection(post.id)
    let res = await client.getMyCollection()
    expect(res.data.data.getMyCollection.length).toEqual(2)
  })
  it('removes post from collection', async () => {
    let res = await client.removePostFromMyCollection(post.id)
    expect(res.data.data.removePostFromMyCollection).toBeTruthy()
    res = await client.removePostFromMyCollection(post.id)
    expect(res.data.data.removePostFromMyCollection).toBeTruthy()
    res = await client.getMyCollection()
    expect(res.data.data.getMyCollection.length).toEqual(1)
  })
})
