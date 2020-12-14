import { Users } from '../../entity/User'
import { startServer } from '../../startServer'
import { Server } from 'http'
import { TestClient } from '../../test/testClient'
import { duplicateEmail } from '../../utils/auth/AuthErrors'
import { redis } from '../../server_configs/redisServer'
import faker from 'faker'
import { mockPassword } from '../../test/mockData'

let email1 = faker.internet.email()
let email2 = faker.internet.email()
let email3 = faker.internet.email()
let badEmail = 'asa@a'
let badPassword = 'aaaaa'
let server: Server
let req_url: string
let client: any

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

describe('register user activity', () => {
  it('register new user1', async () => {
    const response = await client.register(email1, mockPassword)
    expect(response.data.data.register.success).toBeTruthy()
    const user = await Users.findOne({
      where: { email: email1 },
    })
    expect(user?.email).toBe(email1)
  })

  it('register new user2', async () => {
    const response = await client.register(email2, mockPassword)
    expect(response.data.data.register.success).toBeTruthy()
    const user = await Users.findOne({
      where: { email: email2 },
    })
    expect(user?.email).toBe(email2)
  })

  it('register new user3', async () => {
    const response = await client.register(email3, mockPassword)
    expect(response.data.data.register.success).toBeTruthy()
    const user = await Users.findOne({
      where: { email: email3 },
    })
    expect(user?.email).toBe(email3)
  })

  it('register existing email', async () => {
    const response = await client.register(email1, mockPassword)
    expect(response.data.data.register.error[0]).toEqual(duplicateEmail)
  })

  it('check for valid error messages', async () => {
    const response = await client.register(badEmail, badPassword)
    expect(response.data.data.register.error.length).toBeGreaterThan(0)
    response.data.data.register.error.forEach((e: any) => {
      expect(e).toHaveProperty('path')
      expect(e).toHaveProperty('message')
    })
  })
})
