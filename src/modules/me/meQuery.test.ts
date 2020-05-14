import axios from 'axios'
import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'

let user: Users
let userId: string
const email = 'bob5@bob.com'
const password = 'jlkajoioiqwe'

beforeAll(async () => {
  await startServer()
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
  test('create user via typeorm', async () => {
    user = await Users.create({
      email,
      password,
    })
    userId = user.id
    user.confirm = true
    user.save()
    expect(user).toBeTruthy()
  })

  it('fetches with session', async () => {})

  test('get current user with axios', async () => {
    await axios
      .post(
        process.env.TEST_HOST as string,
        {
          query: loginMutation(email, password),
        },
        {
          withCredentials: true,
        },
      )
      .then(res => {
        console.log('axios login: ', res.headers)
      })
      .catch(e => {
        console.log('login: ', e)
      })

    const response = await axios
      .post(
        process.env.TEST_HOST as string,
        {
          query: meQuery,
        },
        {
          withCredentials: true,
        },
      )
      .catch(e => {
        console.log('meQuery error: ', e)
      })

    if (response) {
      console.log('meQuery: ', response.headers)
      expect(response.data.data.me).toEqual({
        email,
        id: userId,
      })
    }
  })
})
