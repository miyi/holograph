import { promisify } from 'util'
import { createClient } from 'redis'

let client
let asyncClient:any
const foo = 'foo'
const bar = 'bar'

beforeAll(async () => {
  client = createClient()
  asyncClient = promisify(client.sendCommand).bind(client)
})

describe('async redis tests', () => {
  it('sets foo', async () => {
    let reply = await asyncClient('set', [foo, bar])
    console.log('set reply: ', reply)
    expect(reply).toBeTruthy
  })
  it('gets foo', async () => {
    let reply = await asyncClient('get', [foo])
    console.log('get reply: ', reply)
    expect(reply).toEqual(bar)
	})
	it('deletes foo', async () => {
		let reply = await asyncClient('del', [foo])
		console.log('del reply: ', reply);
		expect(reply).toEqual(1)
  })
})
