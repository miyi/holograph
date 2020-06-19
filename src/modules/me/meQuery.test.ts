import { TestClient } from '../../utils/testClient'
import { Users } from '../../entity/Users'
import { startApolloServer } from '../../startApolloServer'
import { Server } from 'http'

let user: Users
let server: Server
let userId: string
let req_url: string
let client: any
const email = 'bob5@bob.com'
const password = 'jlkajoioiqwe'

beforeAll(async () => {
  server = await startApolloServer()
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
    user = await Users.create({
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
