import { Server } from 'http'
import { TestClient } from '../../test/testClient'
import { sessionUserError } from '../../utils/auth/AuthErrors'
import { createMockUser, mockPassword } from '../../test/mockData'
import { testServerSetup, testTeardown } from '../../test/testSetup'

let client: any
let server: Server
let user1: any

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user1 = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('testing logoutAll', () => {
  it('logging in', async () => {
    let res = await client.login(user1.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('query me when logged in', async () => {
    let res = await client.me()
    expect(res.data.data.me.email).toEqual(user1.email)
  })
  it('try logoutAll', async () => {
    let res = await client.logoutAll()
    expect(res.data.data.logoutAll.success).toBeTruthy()
    expect(res.data.data.logoutAll.error).toEqual([])
  })
  it('me query after logout', async () => {
    let res = await client.me()
    expect(res.data.data.me).toBeNull()
  })
  it('logoutAll while not logged in', async () => {
    let res = await client.logoutAll()
    expect(res.data.data.logoutAll.success).toBeFalsy()
    expect(res.data.data.logoutAll.error).toEqual([sessionUserError])
  })
})
