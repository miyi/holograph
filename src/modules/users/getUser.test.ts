import { AxiosResponse } from 'axios'
import { Server } from 'http'
import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'

let server: Server
let client: TestClient
let email = 'jim@jim.com'
let password = 'password123'
let req_url: string
let user: any

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TestClient(req_url)
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
  await server.close()
})

describe('getUser tests', () => {
  let res: AxiosResponse
  it('creates new user', async () => {
    user = await Users.create({
      email,
      password,
      confirm: true,
    }).save()
    console.log(user)
    expect(user.id).toBeTruthy()
  })
  it('logging in', async () => {
    res = await client.login(email, password)
    expect(res.data.data.login.success).toBeTruthy()
  })
  it('getUserById', async () => {
    console.log('jest id: ', user.id)
    res = await client.getUserById(user.id)
    expect(res.data.data.getUserById.email).toEqual(user.email)
  })
  it('getUserByEmail', async () => {
    res = await client.getUserByEmail(email)
    expect(res.data.data.getUserByEmail.id).toEqual(user.id)
  })
})
