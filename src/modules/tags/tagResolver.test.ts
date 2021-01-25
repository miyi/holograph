import { testServerSetup, testTeardown } from '../../test/testSetup'
import { Server } from 'http';
import { createMockPostByUser, createMockUser, mockPassword } from '../../test/mockData';
import { TestClient } from '../../test/testClient';

let server: Server
let client: TestClient
let user: any
let post: any

beforeAll(async () => {
	server = await testServerSetup()
	client = new TestClient()
	user = await createMockUser()
	post = await createMockPostByUser(user)
})
afterAll(async () => {
  await testTeardown(server)
})

describe('tag resolver test', () => {
	it('logs in', async() => {
		const res = await client.login(user.email, mockPassword)
		expect(res.data.data.login.success).toBeTruthy()
	})
})