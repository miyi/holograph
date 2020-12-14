import { Server } from 'http'
import { Post } from '../../entity/Post'
import { Profile } from '../../entity/Profile'
import { Users } from '../../entity/User'
import { createMockPostByUser, createMockUser } from '../../test/mockData'
import { testSetup, testTeardown } from '../../test/testSetup'

let server: Server
// let client: TestClient
let user: any
let post1: any
let post2: any

beforeAll(async () => {
  server = await testSetup()
  // client = new TestClient()
  user = await createMockUser()
  post1 = await createMockPostByUser(user)
  post2 = await createMockPostByUser(user)
})

afterAll(() => {
  testTeardown(server)
})

describe('profileCore tests', () => {
  it('retrieves profile', async () => {
    let res = await Users.findOne({
      relations: ['profile'],
      where: {
        id: user.id,
      },
    })
    expect(res?.profile.id).toBeTruthy()
  })
  it('retrieves posts', async () => {
    expect(post1.id).toBeTruthy()
    expect(post2.id).toBeTruthy()
    let res = await Post.find({
      relations: ['author'],
    })
    console.log(res)
  })
  it('find profile by user and insert post to collection', async () => {
    let profile = await Profile.findOne({
      relations: ['user', 'collection'],
      where: {
        user: {
          id: user.id,
        },
      },
    })
    console.log('profile: ', profile)
  })

  // it('getMyProfile not logged out and logged in', async () => {
  //   let res = await client.getMyProfile()
  //   expect(res.data.data.getMyProfile).toBeNull()
  //   await client.login(email, password)
  //   res = await client.getMyProfile()
  //   expect(res.data.data.getMyProfile?.id).toBeTruthy()
  //   expect(res.data.data.getMyProfile.user.email).toEqual(email)
  // })
  // it('creates 2nd post, add to collection', async () => {
  //   expect(post2.id).toBeTruthy()
  //   let res = await client.addPostToMyCollection(post2.id)
  //   expect(res.data.data.addPostToMyCollection).toBeTruthy()
  //   let profile = await Profile.findOne({
  //     relations: ['collection'],
  //   })
  //   expect(profile?.collection.length).toBeGreaterThan(1)
  // })
  // it('adds a duplicate post', async () => {
  //   await client.addPostToMyCollection(post2.id)
  //   let profile = await Profile.findOne({
  //     relations: ['collection'],
  //   })
  //   expect(profile?.collection.length).toBeLessThanOrEqual(2)
  // })
  // it('removes post from my collection', async () => {
  //   let res = await client.removePostFromMyCollection(post1.id)
  //   expect(res.data.data.removePostFromMyCollection).toBeTruthy()
  //   let profile = await Profile.findOne({
  //     relations: ['collection'],
  //   })
  //   expect(profile?.collection.length).toBeLessThan(2)
  // })
  // it('removes a post no in my collection', async () => {
  //   let res = await client.removePostFromMyCollection(post1.id)
  //   expect(res.data.data.removePostFromMyCollection).toBeTruthy()
  //   let profile = await Profile.findOne({
  //     relations: ['collection'],
  //   })
  //   expect(profile?.collection.length).toBeLessThanOrEqual(1)
  // })
  // it('updates profile description', async () => {
  //   let res = await client.updateMyProfileDescription(profileDescription)
  //   expect(res.data.data.updateMyProfileDescription.description).toEqual(
  //     profileDescription,
  //   )
  // })
  // it('deletes user and cascade delete posts and profile', async () => {
  //   let deleteThisUser = await Users.findOne()
  //   await Users.remove(deleteThisUser as Users)
  //   let profile = await Profile.findOne()
  //   expect(profile).toBeUndefined()
  //   let myPost = await Post.findOne()
  //   expect(myPost).toBeUndefined()
  // })
})
