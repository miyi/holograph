import { startApolloServer } from '../../startApolloServer'
import fetch from 'node-fetch'
import { Server } from 'http'
import { request } from 'graphql-request'

let server: Server
let url: string

const hello = `
	{
		hello
	}
`

beforeAll(async () => {
  server = await startApolloServer()
  if (process.env.HOST_URL) {
    url = process.env.HOST_URL
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
  server.close()
})

describe('dummy server test', () => {
  it('fetches from home /, expects home in response text', async () => {
    const response = await fetch(url).then((res) => res.text())
    expect(response).toEqual('home')
  })

  it('fetches from /test, expects test in response text', async () => {
    const testURL = url + '/test'
    const response = await fetch(testURL).then((res) => res.text())
    expect(response).toEqual('fetch received')
	})
	
	it('graphql-request hello query', async () => {
		const response = await request(
			url + '/graphql',
			hello
		)
		expect((response as any).hello).toEqual('Hello World')
	})
})
