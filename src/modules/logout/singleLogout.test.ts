import { Server } from 'http'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import { createMockUser, mockPassword } from '../../test/mockData'

let client: any
let server: Server
let user: any

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('testing logout', () => {
  it('logging in', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('query me when logged in', async () => {
    let res = await client.me()
    expect(res.data.data.me.email).toEqual(user.email)
  })
  it('logging out', async () => {
    let res = await client.logout()
    expect(res.data.data.logout.success).toBeTruthy()
    expect(res.data.data.logout.error).toEqual([])
  })
  it('me query after logout', async () => {
    let res = await client.me()
    expect(res.data.data.me).toBeNull()
  })
  it('logging out while not logged in', async () => {
    let res = await client.logout()
    expect(res.data.data.logout.error[0].path).toEqual('session')
    expect(res.data.data.logout.error[0].message).not.toBeNull()
  })
})
