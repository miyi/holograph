import { Server } from 'http'
import {
  createMockUser,
  createMockPostInput,
  mockPassword,
  createMockTag,
} from '../../test/mockData'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import stringifyObject from 'stringify-object'
let server: Server
let client: TestClient
let user: any
let postInput = createMockPostInput()
let tag1: any  
let postId: string

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
  tag1 = createMockTag()
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
    let res = await client.axiosInstance.post('/', {
      query: `
        mutation {
          createPost(postInput: {
            title: "${postInput.title}" 
            body: "${postInput.body}"
          }) {
            id
            title
            body
            tags {
              name
            }
          }
        }
      `,
    })
    postId = res.data.data.createPost.id
    expect(postId).toBeTruthy()
    const tagArray = [tag1]
    const tagArrayStr = stringifyObject(tagArray, {
      singleQuotes: false,
    })
    res = await client.axiosInstance.post('/', {
      query: `
        mutation {
          tagAndPublishPost(id: "${res.data.data.createPost.id}", tags: ${tagArrayStr})
        }
      `,
    })
    expect(res.data.data.tagAndPublishPost).toEqual(postId)
  })
  it('double check post tags', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
        {
          getPostById(id: "${postId}") {
            id
            published
            tags {
              name
            }
          }
        }
      `
    })
    console.log(res.data.data);
  })
})
