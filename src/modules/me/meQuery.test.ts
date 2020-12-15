import { TestClient } from '../../test/testClient'
import { User } from '../../entity/User'
import { startServer } from '../../startServer'
import { Server } from 'http'

let user: User
let server: Server
let userId: string
let req_url: string
let client: any
const email = 'bob5@bob.com'
const password = 'jlkajoioiqwe'

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

describe('me', () => {
  it('create user via typeorm', async () => {
    user = await User.create({
      email,
      password,
    })
    user.confirm = true
    await user.save()
    userId = user.id
  })

  it('get current user with axios', async () => {
    await client.login(email, password)

    const meResponse = await client.me()

    expect(meResponse.data.data.me).toEqual({
      email,
      id: userId,
    })
  })
})
