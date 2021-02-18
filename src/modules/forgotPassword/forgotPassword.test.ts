import { TestClient } from '../../test/testClient'
import { Server } from 'http'
import { createForgotPasswordLink } from '../../utils/createLink'
import { asyncRedis } from '../../server_configs/redisServer'
import { forgotPasswordPrefix } from '../../utils/constants'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import { createMockUser, mockPassword } from '../../test/mockData'

let user: any
let server: Server
let linkId: string
let client: TestClient
let forgotPasswordLink: string
const badPassword = 'as'
const newPassword = 'asdfagar'

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('forgotPassword test suite', () => {
  it('logs in as user', async () => {
    let res = await client.login(user.email, mockPassword)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('requests forgotPasswordLink', async () => {
    forgotPasswordLink = await createForgotPasswordLink(
      process.env.HOST_URL as string,
      user.id,
      asyncRedis,
    )
    const parts: string[] = forgotPasswordLink.split('/')
    linkId = parts[parts.length - 1]
    const redisStoreUserId = await asyncRedis('get', [
      forgotPasswordPrefix + linkId,
    ])
    expect(redisStoreUserId).toEqual(user.id)
  })
  it('check if logged out', async () => {
    let res = await client.me()
    expect(res.data.data.me).toBeFalsy()
  })
  it('uses badNewPassword to change password', async () => {
    let res = await client.forgotPasswordChange(linkId, badPassword)
    expect(res.data.data.forgotPasswordChange.success).toBeFalsy()
    console.log('errors', res.data.data.forgotPasswordChange.error[0])
    expect(res.data.data.forgotPasswordChange.error).toBeTruthy()
  })
  it('uses forgotPasswordLink to change password', async () => {
    let res = await client.forgotPasswordChange(linkId, newPassword)
    expect(res.data.data.forgotPasswordChange.success).toBeTruthy()
    expect(res.data.data.forgotPasswordChange.error).toEqual([])
  })
  it('logs in with newPassword', async () => {
    await client.login(user.email, newPassword)
    let res = await client.me()
    console.log(res.data.data.me)
    expect(res.data.data.me.email).toEqual(user.email)
  })
})
