import { Server } from 'http'
import { redis } from '../../server_configs/redisServer'
import { startServer } from '../../startServer'
// import { TestClient } from '../../test/testClient'
import { Users } from '../../entity/Users'
import { Posts } from '../../entity/Posts'

let server: Server
// let req_url: string
// let client: TestClient

const email = 'jim@jim.com'
const password = 'password123'
let user: any
let post: any
const postTitle1 = 'typeorm insert'

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    // req_url = process.env.HOST_URL + '/graphql'
    // client = new TestClient(req_url)
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
})
