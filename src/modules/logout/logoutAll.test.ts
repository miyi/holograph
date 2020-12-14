import { Server } from 'http'
import { TestClient } from '../../test/testClient'
import { Users } from '../../entity/User'
import { sessionUserError } from '../../utils/auth/AuthErrors'
import { startServer } from '../../startServer'
import { redis } from '../../server_configs/redisServer'
import { createMockUser, mockPassword } from '../../test/mockData'

let req_url: string
let client: any
let server: Server
let user1: Users


beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TestClient(req_url)
  } else {
    throw Error('missing host url')
  }
})

afterAll( async () => {
  await server.close()
  await new Promise((resolve) => {
    redis.quit(() => {
      resolve(true)
    })
  })
})

describe('testing logoutAll', () => {
  it('creates new user', async () => {
    let user1 = await createMockUser()
    expect(user1.id).toBeTruthy()
  })
  it('logging in', async () => {
    let res = await client.login(user1.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('query me when logged in', async () => {
    let res = await client.me()
    expect(res.data.data.me.email).toEqual(user1.email)
  })
  it('try logoutAll', async () => {
    let res = await client.logoutAll()
    expect(res.data.data.logoutAll.success).toBeTruthy()
    expect(res.data.data.logoutAll.error).toEqual([])
  })
  it('me query after logout', async () => {
    let res = await client.me()
    expect(res.data.data.me).toBeNull()
  })
  it('logoutAll while not logged in', async () => {
    let res = await client.logoutAll()
    expect(res.data.data.logoutAll.success).toBeFalsy()
    expect(res.data.data.logoutAll.error).toEqual([sessionUserError])
  })
})
