import { startServer } from '../../startServer'
import { Server } from 'http'
import { TestClient } from '../../utils/testClient'

const foo = 'foo'
const bar = 'bar'
let server: Server
let req_url: string
let client: any

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

describe('redis tests on apollo server', () => {
  it('sets [foo, bar]', async () => {
    let reply = await client.setRedis(foo, bar)
    expect(reply.data.data.setRedis).toEqual('OK')
  })
  it('gets foo from redis', async () => {
    let reply = await client.getRedis(foo)
    expect(reply.data.data.getRedis).toEqual(bar)
  })
  it('del foo from redis', async () => {
    let reply = await client.delRedis(foo)
    expect(reply.data.data.delRedis).toEqual('1')
    let value = await client.getRedis(foo)
    expect(value.data.data.getRedis).toBeNull()
  })
  it('async set -> get -> del', async () => {
    await client.setRedis(foo, bar)
    let getReply = await client.getRedis(foo)
    expect(getReply.data.data.getRedis).toEqual(bar)
    let delReply = await client.delRedis(foo)
    console.log('del: ', delReply.data.data.delRedis)
    let getDeleted = await client.getRedis(foo)
    console.log('getDeleted: ', getDeleted.data.data.getRedis)
    expect(getDeleted.data.data.getRedis).toBeNull()
  })
})
