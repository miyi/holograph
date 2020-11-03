import { AxiosResponse } from 'axios'
import { Server } from 'http'
import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'

let server: Server
let client: TestClient
const email = 'jim@jim.com'
const newEmail = 'ming@ming.ca'
const password = 'password123'
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
    res = await client.getUserById(user.id)
    expect(res.data.data.getUserById.email).toEqual(user.email)
  })
  it('getUserByEmail', async () => {
    res = await client.getUserByEmail(email)
    expect(res.data.data.getUserByEmail.id).toEqual(user.id)
  })
  it('changes user email', async () => {
    res = await client.updateUserEmail(newEmail)
    expect(res.data.data.updateUserEmail).toBeTruthy()
  })
})
