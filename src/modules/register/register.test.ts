import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
import { duplicateEmail } from './errorMessages'
import { Server } from 'http'
import { TestClient } from '../../utils/testClient'

let email = 'bob@bob.com'
let password = 'asasdfasdfasdf'
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
})

describe('register user activity', () => {
  it('register new user', async () => {
    const response = await client.register(email, password)
    expect(response.data.data.register.success).toBeTruthy()
    const users = await Users.find({
      where: { email },
    })
    expect(users).toHaveLength(1)
    const user = users[0]
    expect(user.email).toBe(email)
    expect(user.password).not.toBe(password)
  })

  it('register existing email', async () => {
    const response = await client.register(email, password)
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
