import { Server } from 'http'
import { User } from '../../entity/User'
import { createMockUser, mockPassword } from '../../test/mockData'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import { alreadyLoggedIn } from '../../utils/errorMessage/AuthErrors'

let server: Server
let bademail = 'bob@bob.com'
let badpassword = 'notrealpassword'
let badinput = 'aaa'
let user: User
let client: TestClient

beforeAll(async () => {
  server = await testServerSetup()
  user = await createMockUser()
  client = new TestClient()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('login in user', () => {
  it('tests login resolver', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
    res = await client.logout()
    expect(res.data.data.logout.success).toBeTruthy()
  })
  it('bad input', async () => {
    let res = await client.login(badinput, mockPassword)
    expect(res.data.data.login.success).toBeFalsy()
    expect(res.data.data.login.error.length).toBeGreaterThan(0)
  })
  it('bad email', async () => {
    let res = await client.login(bademail, mockPassword)
    expect(res.data.data.login.success).toBeFalsy()
    expect(res.data.data.login.error[0].path).toEqual('email')
    expect(res.data.data.login.error[0].message).toEqual('incorrect email')
  })
  it('bad password', async () => {
    let res = await client.login(user.email, badpassword)
    expect(res.data.data.login.success).toBeFalsy()
    expect(res.data.data.login.error[0].path).toEqual('password')
    expect(res.data.data.login.error[0].message).toEqual('incorrect password')
  })

  it('log in again while already logged in', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
    let user2 = await createMockUser()
    res = await client.login(user2.email, mockPassword)
    expect(res.data.data.login.error[0]).toEqual(alreadyLoggedIn)
  })
})
