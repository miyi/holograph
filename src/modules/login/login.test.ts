import { startServer } from '../../startServer'
import { Server } from 'http'
import { Users } from '../../entity/Users'
import request from 'graphql-request'

let server: Server
let email = 'jim@jim.com'
let password = 'password123'
let bademail = 'bob@bob.com'
let badpassword = 'notrealpassword'
let badinput = 'aaa'
let req_url: string

const mutation = (email: string, password: string) => `
	mutation {
		login(email: "${email}", password: "${password}") {
			success
      error {
				path
				message
			}
    }
	}
`

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
  await server.close()
})

describe('login in user', () => {
  it('registers a user via typeorm', async () => {
    await Users.create({
      email,
      password,
    }).save()
    const user: any = await Users.findOne({
      where: {
        email,
      },
    })
    user.confirm = true
    Users.save(user)
    expect(user).not.toBeNull()
  })

  it('tests login resolver', async () => {
    const loginResponse: any = await request(req_url, mutation(email, password))
    expect(loginResponse.login.success).toBeTruthy()
  })
  it('bad input', async () => {
    const loginResponse: any = await request(
      req_url,
      mutation(badinput, badinput),
    )
    expect(loginResponse.login.success as any).toBeFalsy()
  })
  it('bad email', async () => {
    const loginResponse: any = await request(
      req_url,
      mutation(bademail, password),
    )
    expect(loginResponse.login.success).toBeFalsy()
    expect(loginResponse.login.error[0].path).toEqual('email')
    expect(loginResponse.login.error[0].message).toEqual('incorrect email')
  })
  it('bad password', async () => {
    const loginResponse: any = await request(
      req_url,
      mutation(email, badpassword),
    )
    expect(loginResponse.login.success).toBeFalsy()
    expect(loginResponse.login.error[0].path).toEqual('password')
    expect(loginResponse.login.error[0].message).toEqual('incorrect password')
  })
})
