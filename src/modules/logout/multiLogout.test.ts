import { startApolloServer } from '../../startApolloServer'
import { Server } from 'http'
import { TestClient } from '../../utils/testClient'
import { Users } from '../../entity/Users'

let req_url: string
let server: Server
const email = 'bob@bob.com'
const password = 'asdfasdfasd'
let sess1: any
let sess2: any


beforeAll(async () => {
  server = await startApolloServer().catch(err => {throw Error(err)})
  if (process.env.HOST_URL) {
		req_url = process.env.HOST_URL + '/graphql'
  } else {
    throw Error('missing host url')
	}
	sess1 = new TestClient(req_url)
	sess2 = new TestClient(req_url)
})

afterAll(() => {
  if (server) server.close()
})

describe('testing logging out of multiple devices', () => {
	it('creates new user', async() => {
		const user = await Users.create({
			email,
			password,
		})
		user.confirm = true
		await user.save()
		expect(user.id).not.toBeNull()
	})
	it('login with 2 sessions', async () => {
		await sess1.login(email, password)
		await sess2.login(email, password)
		const logoutRes = await sess1.logout()
		expect(logoutRes.data.data.logout.success).toBeTruthy()
		const meRes1 = await sess1.me()
		const meRes2 = await sess2.me()
		expect(meRes1.data.data.me).toBeNull()
		expect(meRes2.data.data.me).not.toBeNull()
	})
})