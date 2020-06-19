import axios, { AxiosResponse } from 'axios'
import { startApolloServer } from '../../startApolloServer'
import { Server } from 'http'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'

axiosCookieJarSupport(axios)
const cookieJar = new tough.CookieJar()
const withCredentials = false

let REQUEST_URL: string
let server: Server
jest.setTimeout(3 * 60 * 1000)
const urlQuery = `
	{
		url
	}
`

const helloQuery = `
  {
    hello
  }
`

const setSession = `
	mutation {
		setSessionDummy1
	}
`

const readSession = `
	query {
  	readSessionDummy1
	}
`

beforeAll(async () => {
  server = await startApolloServer()
  if (process.env.HOST_URL)
    REQUEST_URL = process.env.HOST_URL + '/graphql'
})

afterAll(() => {
  if (server) server.close()
})

describe('axios tests', () => {
  it('makes a url query call', async () => {
    const response = await axios
      .post(
        REQUEST_URL,
        {
          query: urlQuery,
        },
        {
          withCredentials,
          jar: cookieJar,
        },
      )
      .catch((error: any) => {
        console.log(error)
      })
    expect((response as any).data.data.url).toEqual(process.env.HOST_URL)
  })

  it('sets session', async () => {
    const setResponse: any = await axios
      .post(
        REQUEST_URL,
        { query: setSession },
        { withCredentials, jar: cookieJar},
      )
      .catch((e: any) => console.log(e))

    expect(typeof setResponse.data.data.setSessionDummy1).toBe('string')
  })

  it('reads session', async () => {
    const readResponse: any = await axios
      .post(
        REQUEST_URL,
        { query: readSession },
        { withCredentials, jar: cookieJar },
      )
      .catch((e: any) => console.log(e))
    expect(readResponse.data.data.readSessionDummy1).toBe('true')
  })

  it('axios instance call', async() => {
    const instance = axios.create({
      baseURL: REQUEST_URL,
      withCredentials,
      jar: cookieJar
    })
    const helloResponse: AxiosResponse = await instance.post(
      '/',
      {
        query: helloQuery
      }
    ).catch(e => {throw Error(e)})
    expect(helloResponse.data.data.hello).toEqual('Hello World')

  })
})
