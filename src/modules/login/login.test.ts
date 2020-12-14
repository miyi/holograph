import { Server } from 'http'
import { Users } from '../../entity/User'
import { redis } from '../../server_configs/redisServer'
import { startServer } from '../../startServer'
import { createMockUser, mockPassword } from '../../test/mockData'
import { TestClient } from '../../test/testClient'

let server: Server
let bademail = 'bob@bob.com'
let badpassword = 'notrealpassword'
let badinput = 'aaa'
let req_url: string
let user: Users
let client: TestClient

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
      resolve(true)
    })
  })
})

describe('login in user', () => {
  it('registers a user via typeorm', async () => {
    user = await createMockUser()
    expect(user).toBeTruthy()
  })

  it('tests login resolver', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
    res = await client.logout()
    expect(res.data.data.logout.success).toBeTruthy()
  })
  it('bad input', async () => {
    let res = await client.login(badinput, mockPassword)
    expect(res.data.data.login.success).toBeFalsy()
    expect(res.data.data.login.error.length).toBeGreaterThan(0)
  })
  it('bad email', async () => {
    let res = await client.login(bademail, mockPassword)
    expect(res.data.data.login.success).toBeFalsy()
    expect(res.data.data.login.error[0].path).toEqual('email')
    expect(res.data.data.login.error[0].message).toEqual('incorrect email')
  })
  it('bad password', async () => {
    let res = await client.login(user.email, badpassword)
    expect(res.data.data.login.success).toBeFalsy()
    expect(res.data.data.login.error[0].path).toEqual('password')
    expect(res.data.data.login.error[0].message).toEqual('incorrect password')
  })

  it('log in again while already logged in', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
    let user2 = await createMockUser()
    res = await client.login(user2.email, mockPassword)
    console.log(res.data.data.login.error[0])
  })
})
