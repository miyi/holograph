import { Server } from 'http'
import { Posts } from '../../entity/Posts'
import { Profiles } from '../../entity/Profiles'
// import { TestClient } from '../../test/testClient'
import { Users } from '../../entity/Users'
import { redis } from '../../server_configs/redisServer'
import { startServer } from '../../startServer'

let server: Server
// let req_url: string
// let client: TestClient

const email = 'jim@jim.com'
const password = 'password123'
let user: any
let post: any
const postTitle1 = 'typeorm insert'

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    // req_url = process.env.HOST_URL + '/graphql'
    // client = new TestClient(req_url)
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
  await server.close()
  await new Promise((resolve) => {
    redis.quit(() => {
      resolve()
    })
  })
})

describe('postCore tests', () => {
  it('creates user and post', async () => {
    user = await Users.create({
      email,
      password,
    }).save()
    expect(user.id).not.toBeNull()
    post = await Posts.create({
      title: postTitle1,
      author: user,
    }).save()
    expect(post.id).not.toBeNull()
  })
  it('retrieves profile', async () => {
    let res = await Users.findOne({
      relations: ['profile'],
      where: {
        id: user.id,
      },
    })
    expect(res?.profile.id).toBeTruthy()
  })
  it('find profile by user and insert post to collection', async () => {
    let profile = await Profiles.findOne({
      relations: ['user', 'collection'],
      where: {
        user: {
          id: user.id,
        },
      },
    })
    if (profile) profile.collection.push(post)
    await profile?.save()
    let collection = await Profiles.findOne({
      relations: ['collection'],
    })
    console.log(collection)
  })
  it('deletes user and cascade delete posts and profile', async () => {
    let deleteThisUser = await Users.findOne()
    await Users.remove(deleteThisUser as Users)
    let profile = await Profiles.findOne()
    expect(profile).toBeUndefined()
    let myPost = await Posts.findOne()
    expect(myPost).toBeUndefined()
  })
})
