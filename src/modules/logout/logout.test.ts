import { startApolloServer } from '../../startApolloServer'
import { Server } from 'http'
import { TestClient } from '../../utils/testClient'
import { AxiosResponse } from 'axios'
import { Users } from '../../entity/Users'

let req_url: string
let client: any
let server: Server
const email = 'bob@bob.com'
const password = 'asdfasdfasd'


beforeAll(async () => {
  server = await startApolloServer()
  if (process.env.HOST_URL) {
		req_url = process.env.HOST_URL + '/graphql'
		client = new TestClient(req_url)
  } else {
    throw Error('missing host url')
  }
})

afterAll(() => {
  if (server) server.close()
})

describe('testing logout', () => {
	let res: AxiosResponse
	it('creates new user', async() => {
		const user = await Users.create({
			email,
			password,
		})
		user.confirm = true
		await user.save()
		expect(user.id).not.toBeNull()
	})
  it('logging in', async() => {
		res = await client.login(email, password)
		expect(res.data.data.login.success).toBeTruthy()
	})
	it('query me when logged in', async () => {
		res = await client.me()
		expect(res.data.data.me.email).toEqual(email)
	})
	it('logging out', async () => {
		res = await client.logout()
		console.log('with session: ', res.headers)
		expect(res.data.data.logout.success).toBeTruthy()
	})
	it('query after logout', async () => {
		res = await client.me()
		expect(res.data.data.me).toBeNull()
	})
	it('logging out with error', async () => {
		res = await client.logout(false)
		console.log('no session: ', res.headers)
		expect(res.data.data.logout.success).toBeFalsy
		expect(res.data.data.logout.error.path).toEqual('session')
		console.log(res.data.data.logout.error.message)
		expect(res.data.data.logout.error.message).not.toBeNull()
	})
})
