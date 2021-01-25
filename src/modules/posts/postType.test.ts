import { Server } from 'http'
import { createMockUser, createMockPostByUser } from '../../test/mockData'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'
let server: Server
let client: TestClient
let user: any
let post: any

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
  post = await createMockPostByUser(user)
  await createMockPostByUser(user)
  await createMockPostByUser(user)
})

afterAll(async () => {
  await testTeardown(server)
})

describe('post typeorm tests', () => {
	it('')
})