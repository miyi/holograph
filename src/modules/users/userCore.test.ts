import { AxiosResponse } from 'axios'
import { Server } from 'http'
import { Post } from '../../entity/Post'
import { User } from '../../entity/User'
import { redis } from '../../server_configs/redisServer'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'

let server: Server
let client: TestClient
const email = 'jim@jim.com'
const newEmail = 'ming@ming.ca'
const password = 'password123'
const postTitle = 'movie review'
let req_url: string
let user: User
let post: Post

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
  new Promise((resolve) => {
    redis.quit(() => {
      resolve()
    })
  })
})

describe('getUser tests', () => {
  let res: AxiosResponse
  it('creates new user and new post', async () => {
    user = await User.create({
      email,
      password,
      confirm: true,
    }).save()
    post = await Post.create({
      title: postTitle,
      author: user,
    }).save()

    expect(user.id).toBeTruthy()
    expect(post.id).toBeTruthy()
  })
  it('logging in', async () => {
    res = await client.login(email, password)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('getUserById', async () => {
    res = await client.getUserById(user.id)
    expect(res.data.data.getUserById.email).toEqual(user.email)
  })
  it('getUserByEmail', async () => {
    res = await client.getUserByEmail(email)
    expect(res.data.data.getUserByEmail.id).toEqual(user.id)
  })
  it('changes user email', async () => {
    res = await client.updateUserEmail(newEmail)
    expect(res.data.data.updateUserEmail).toBeTruthy()
  })
  it('chain queries user and posts', async () => {
    res = await client.seeUserPostFromUserId(user.id)
    expect(res.data.data.getUserById.posts.length).toBeGreaterThan(0)
    expect(res.data.data.getUserById.posts[0].id).toEqual(post.id)
  })
})
