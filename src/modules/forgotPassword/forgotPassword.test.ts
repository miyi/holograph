import { TestClient } from '../../utils/testClient'
import { Users } from '../../entity/Users'
<<<<<<< HEAD
import { startServer } from '../../startServer'
=======
>>>>>>> socialauth
import { Server } from 'http'
import { AxiosResponse } from 'axios'
import { createForgotPasswordLink } from '../../utils/createLink'
import { asyncRedis } from '../../server_configs/redisServer'
import { forgotPasswordPrefix } from '../../utils/constants'
import { startServer } from '../../startServer'

let user: Users
let server: Server
let userId: string
let req_url: string
let linkId: string
let client: TestClient
let res: AxiosResponse
let forgotPasswordLink: string
const email = 'bob5@bob.com'
const password = 'jlkajoioiqwe'
const newPassword = 'asfdsagafbag'
const badNewPassword = '1111'

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TestClient(req_url)
  } else {
    throw Error('no url')
  }
})

afterAll(() => {
  server.close()
})

describe('forgotPassword test suite', () => {
  it('create user via typeorm', async () => {
    user = await Users.create({
      email,
      password,
    })
    user.confirm = true
    await user.save()
    userId = user.id
  })

  it('logs in as user', async () => {
    res = await client.login(email, password)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('requests forgotPasswordLink', async () => {
    forgotPasswordLink = await createForgotPasswordLink(
      req_url,
      userId,
      asyncRedis,
    )
    const parts: string[] = forgotPasswordLink.split('/')
    linkId = parts[parts.length - 1]
    const redisStoreUserId = await asyncRedis('get', [
      forgotPasswordPrefix + linkId,
    ])
    expect(redisStoreUserId).toEqual(userId)
  })
  it('check if logged out', async () => {
    res = await client.me()
    expect(res.data.data.me).toBeFalsy()
  })
  it('uses badNewPassword to change password', async () => {
    res = await client.forgotPasswordChange(linkId, badNewPassword)
    expect(res.data.data.forgotPasswordChange.success).toBeFalsy()
    console.log('errors', res.data.data.forgotPasswordChange.error[0])
    expect(res.data.data.forgotPasswordChange.error).toBeTruthy()
  })
  it('uses forgotPasswordLink to change password', async () => {
    res = await client.forgotPasswordChange(linkId, newPassword)
    expect(res.data.data.forgotPasswordChange.success).toBeTruthy()
    expect(res.data.data.forgotPasswordChange.error).toEqual([])
  })
  it('logs in with newPassword', async () => {
    await client.login(email, newPassword)
    res = await client.me()
    expect(res.data.data.me.email).toEqual(email)
  })
})
