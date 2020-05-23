import { request } from 'graphql-request'
import { Users } from '../../entity/Users'
import { startApolloServer } from '../../startApolloServer'
import { duplicateEmail } from './errorMessages'
import { Server } from 'http'

let email = 'bob@bob.com'
let password = 'asasdfasdfasdf'
let badEmail = 'asa@a'
let badPassword = 'aaaaa'
let server: Server
let req_url: string

beforeAll(async () => {
  server = await startApolloServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
  server.close()
})

const mutation = (email: string, password: string) => `
	mutation {
		register(email: "${email}", password: "${password}") {
      path
      message
    }
	}
`

describe('register user activity', () => {
  it('register new user', async () => {
    const response = await request(req_url, mutation(email, password))
    expect(response).toEqual({ register: null })
    const users = await Users.find({
      where: { email },
    })
    expect(users).toHaveLength(1)
    const user = users[0]
    expect(user.email).toBe(email)
    expect(user.password).not.toBe(password)
  })

  it('register existing email', async () => {
    const response: any = await request(req_url, mutation(email, password))
    expect(response.register.length).toEqual(1)
    expect(response.register[0]).toHaveProperty('path', 'email')
    expect(response.register[0]).toHaveProperty('message', duplicateEmail)
  })

  it('check for valid error messages', async () => {
    const response: any = await request(
      req_url,
      mutation(badEmail, badPassword),
    )
    expect(response.register.length).toBeGreaterThan(0)
    console.log(response.register.length)
    response.register.forEach((e: any) => {
      expect(e).toHaveProperty('path')
      expect(e).toHaveProperty('message')
    })
  })
})
