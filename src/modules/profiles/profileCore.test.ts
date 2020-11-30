import { Server } from 'http'
import { Posts } from '../../entity/Posts'
import { Profiles } from '../../entity/Profiles'
import { TestClient } from '../../test/testClient'
import { Users } from '../../entity/Users'
import { redis } from '../../server_configs/redisServer'
import { startServer } from '../../startServer'

let server: Server
let req_url: string
let client: TestClient

const email = 'jim@jim.com'
const password = 'password123'
let user: any
let post: any
let post2: any
const postTitle1 = 'typeorm insert'
const postTitle2 = 'collection test'
const profileDescription = 'I am a fun guy'

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
  server.close()
  new Promise((resolve) => {
    redis.quit(() => {
      resolve(true)
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
    if (profile) {
      profile.collection.push(post)
    }
    await profile?.save().catch(() => {
      console.log('save error')
    })

    let profileCollection = await Profiles.findOne({
      relations: ['collection'],
    })
    expect(profileCollection?.collection.length).toBeGreaterThan(0)
  })
  it('getProfileByUserId chained with collection post title and user email', async () => {
    let res = await client.getProfileByUserId(user.id)
    expect(res.data.data.getProfileByUserId.id).toBeTruthy()
    expect(res.data.data.getProfileByUserId.collection.length).toBeGreaterThan(
      0,
    )
    expect(res.data.data.getProfileByUserId.user.email).toEqual(email)
  })
  it('getMyProfile not logged out and logged in', async () => {
    let res = await client.getMyProfile()
    expect(res.data.data.getMyProfile).toBeNull()
    await client.login(email, password)
    res = await client.getMyProfile()
    expect(res.data.data.getMyProfile?.id).toBeTruthy()
    expect(res.data.data.getMyProfile.user.email).toEqual(email)
  })
  it('creates 2nd post, add to collection', async () => {
    post2 = await Posts.create({
      title: postTitle2,
      author: user,
    }).save()
    expect(post2.id).toBeTruthy()
    let res = await client.addPostToMyCollection(post2.id)
    expect(res.data.data.addPostToMyCollection).toBeTruthy()
    let profile = await Profiles.findOne({
      relations: ['collection'],
    })
    expect(profile?.collection.length).toBeGreaterThan(1)
  })
  it('adds a duplicate post', async () => {
    await client.addPostToMyCollection(post2.id)
    let profile = await Profiles.findOne({
      relations: ['collection'],
    })
    expect(profile?.collection.length).toBeLessThanOrEqual(2)
  })
  it('removes post from my collection', async () => {
    let res = await client.removePostFromMyCollection(post.id)
    expect(res.data.data.removePostFromMyCollection).toBeTruthy()
    let profile = await Profiles.findOne({
      relations: ['collection'],
    })
    expect(profile?.collection.length).toBeLessThan(2)
  })
  it('removes a post no in my collection', async () => {
    let res = await client.removePostFromMyCollection(post.id)
    expect(res.data.data.removePostFromMyCollection).toBeTruthy()
    let profile = await Profiles.findOne({
      relations: ['collection'],
    })
    expect(profile?.collection.length).toBeLessThanOrEqual(1)
  })
  it('updates profile description', async () => {
    let res = await client.updateMyProfileDescription(profileDescription)
    expect(res.data.data.updateMyProfileDescription.description).toEqual(
      profileDescription,
    )
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
