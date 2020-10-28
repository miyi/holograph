import { Server } from 'http'
import { startServer } from '../../../startServer'
import { TmpTestClient } from '../../../test/tmpTestClient'


const foo = 'foo'
const bar = 'bar'
let server: Server
let req_url: string
let client: any

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TmpTestClient(req_url)
  } else {
    throw Error('no url')
  }
})

afterAll(() => {
  server.close()
})

describe('test resolver chain  setup', () => {
  it('calls the library, book, author n+1 query', async () => {
    let reply = await client.libraries(foo, bar)
    console.log(reply.data.data.libraries);
  })
})
