import { createConfirmEmailLink } from './createLink'
import { Users } from '../entity/Users'
import fetch from 'node-fetch'
import { Server } from 'http'
import { startApolloServer } from '../startApolloServer';
import { asyncRedis } from '../redisServer';

let email = 'timmy@tim.com'
let password = 'lajfjlkakjl'
let badId = '1341b2j34'
let userId = ''
let server: Server
let host_url: string

beforeAll(async () => {
  server = await startApolloServer()
  if(process.env.HOST_URL) host_url = process.env.HOST_URL
  const user = await Users.create({
    email,
    password,
  }).save()
  userId = user.id
})

afterAll(() => {
  server.close()
})

describe('test fetch', () => {
  const fetchLink = '/test'
  it('fetches from server', async () => {
    const fetchServerLink = host_url + fetchLink
    console.log(fetchServerLink)
    const res = await fetch(fetchServerLink).then((res) => res.text())
    expect(res).toEqual('fetch received')
  })
})

describe('tests createConfirmEmailLink', () => {
  it('returns link, confirms user, remove id from cache', async () => {
    const link = await createConfirmEmailLink(
      host_url as string,
      userId,
      asyncRedis,
    )
    expect(link).not.toBeNull()
    //fetch link to confirm user
    const message = await fetch(link).then((res) => res.text())
    expect(message).toEqual('ok')
    const user = await Users.findOne({
      where: {
        email,
      },
    })
    expect(user).not.toBeNull()
    //check if user confirmed
    expect((user as Users).confirm).toBeTruthy()
    const chunks = link.split('/')
    const key = chunks[chunks.length - 1]
    let reply = await asyncRedis('get', [key])
    //check if key is deleted from redis
    expect(reply).toBeNull()
  })
  it('errs when given bad ids', async () => {
    const link = host_url + '/confirm/' + badId
    const message = await fetch(link).then((res) => res.text())
    expect(message).toEqual('invalid')
  })
})