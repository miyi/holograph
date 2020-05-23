import axios, {AxiosInstance, AxiosResponse} from 'axios'
import { Users } from '../../entity/Users'
import { startApolloServer } from '../../startApolloServer'
import { Server } from 'http'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'

axiosCookieJarSupport(axios)
const cookieJar = new tough.CookieJar()

let axiosInstance: AxiosInstance 
let user: Users
let server: Server
let userId: string
const email = 'bob5@bob.com'
const password = 'jlkajoioiqwe'

beforeAll(async () => {
  server = await startApolloServer()
  if (process.env.HOST_URL) {
    const req_url = process.env.HOST_URL + '/graphql'
    axiosInstance = axios.create({
      baseURL: req_url,
      withCredentials: true,
      jar: cookieJar
    })
  } else {
    throw Error('no url')
  }

})

afterAll(() => {
  server.close()
})

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      success
    }
  }
`

const meQuery = `
{
  me {
    id
    email
  }
}
`

describe('me', () => {
  // test("can't get user if not logged in", async () => {
  // later
  // });
  it('create user via typeorm', async () => {
    user = await Users.create({
      email,
      password,
    })
    user.confirm = true
    user.save()
    console.log('userid: ', user.id)
    userId = user.id
    expect(userId).not.toBeUndefined()
    expect(userId).not.toBeNull()
    expect(user).toBeTruthy()
  })

  it('get current user with axios', async () => {
    await axiosInstance
      .post(
        '/',
        {
          query: loginMutation(email, password),
        },
      )
      .catch((e) => {
        throw Error(e)
      })

    const meResponse: AxiosResponse = await axiosInstance
      .post(
        '/',
        {
          query: meQuery,
        },
      )
      .catch((e) => {
        throw Error(e)
      })

      expect(meResponse.data.data.me).toEqual({
        email,
        id: userId,
      })
  })
})
