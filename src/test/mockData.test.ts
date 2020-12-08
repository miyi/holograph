import { Server } from 'http'
import { Posts } from '../entity/Posts'
import { Users } from '../entity/Users'
import { createMockPostByUser, createMockUser } from './mockData'
import { testSetup, testTeardown } from './testSetup'

let server: Server

beforeAll(async () => {
  server = await testSetup()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('check if mockdata works', () => {
  let user1: Users
  let user2: Users
  let user3: Users
  let post1: Posts
  let post2: Posts
  let post3: Posts

  it('creates 3 users', async () => {
    user1 = await createMockUser()
    user2 = await createMockUser()
    user3 = await createMockUser()
    expect(user1.id).toBeTruthy()
    expect(user2.id).toBeTruthy()
    expect(user3.id).toBeTruthy()
  })
  it('creates 3 posts for each of the 3 users', async () => {
    post1 = await createMockPostByUser(user1)
    post2 = await createMockPostByUser(user2)
    post3 = await createMockPostByUser(user3)
    expect(post1.id).toBeTruthy()
    expect(post2.id).toBeTruthy()
    expect(post3.id).toBeTruthy()
    expect(user1.profile.id).toBeTruthy()
  })
  it('finds user by email', async () => {
    let user1res = await Users.findOne({
      where: {
        email: user1.email,
      },
    })
    expect(user1res?.email).toEqual(user1.email)
    let user2res = await Users.findOne({
      where: {
        email: user2.email,
      },
    })
    expect(user2res?.email).toEqual(user2.email)
    let user3res = await Users.findOne({
      where: {
        email: user3.email,
      },
    })
    expect(user3res?.email).toEqual(user3.email)
  })
  it('finds post1 by id', async () => {
    let post1res = await Posts.findOne(post1.id)
    expect(post1res?.title).toEqual(post1.title)
    let post2res = await Posts.findOne(post2.id)
    expect(post2res?.title).toEqual(post2.title)
    let post3res = await Posts.findOne(post3.id)
    expect(post3res?.title).toEqual(post3.title)
  })

  it('creates user1 with posts', async () => {
    user1 = await createMockUser()
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    await createMockPostByUser(user1)
    let res = await Users.findOne({
      relations: ['posts'],
      where: {
        id: user1.id,
      },
    })
    expect(res?.posts.length).toBeGreaterThanOrEqual(10)
  })
})
