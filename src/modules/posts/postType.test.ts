import { Server } from 'http'
import {
  createMockUser,
  createMockPostInput,
  mockPassword,
} from '../../test/mockData'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'
let server: Server
let client: TestClient
let user: any

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('debug post requests', () => {
  it('logs in', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('creates a post', async () => {
    let postInput = createMockPostInput()
    let res = await client.axiosInstance.post('/', {
      query: `
        mutation {
          createPost(postInput: {
            title: "${postInput.title}" 
            body: "${postInput.body}"
          }) {
            title
            body
          }
        }
      `,
    })
    console.log(res.data.data.createPost)
  })
})
