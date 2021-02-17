import { Server } from 'http'
import { getConnection } from 'typeorm'
import { Post } from '../../entity/Post'
import { Profile } from '../../entity/Profile'
import { User } from '../../entity/User'
import { createMockPostByUser, createMockUser, mockPassword } from '../../test/mockData'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'

let server: Server
let client: TestClient
let user: any
let profile: any
let post1: any
let post2: any
let profileDescription = 'once upon a time'

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user = await createMockUser()
  profile = user.profile
  post1 = await createMockPostByUser(user)
  post2 = await createMockPostByUser(user)
})

afterAll(async () => {
  await testTeardown(server)
})

describe('profileCore tests', () => {
  it('retrieves profile', async () => {
    let res = await User.findOne({
      relations: ['profile'],
      where: {
        id: user.id,
      },
    })
    expect(res?.profile.id).toEqual(profile.id)
  })
  it('retrieves posts', async () => {
    expect(post1.id).toBeTruthy()
    expect(post2.id).toBeTruthy()
    let res = await Post.find({
      relations: ['author'],
    })
    expect(res.length).toEqual(2)
  })

  it('creates a query builder to find profile via user.id', async () => {
    let connection = await getConnection()
    const res = await connection
      .getRepository(Profile)
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getOne()
    expect(res?.id).toEqual(profile.id)
  })

  it('direct finds profile via user foreign key', async () => {
    let res = await User.findOne(user.id, {
      relations: ['profile'],
    })
    expect(res?.profile.id).toEqual(profile.id)
  })

  it('direct find user via profile primary key', async () => {
    let res = await Profile.findOne(profile.id, {
      relations: ['user'],
    })
    expect(res?.user.id).toEqual(user.id)
  })

  //Find profile by user id from Profile.FindOne({ ... user.id}) no longer work

  it('getMyProfile not logged out and logged in', async () => {
    let res = await client.getMyProfile()
    expect(res.data.data.getMyProfile).toBeNull()
    await client.login(user.email, mockPassword)
    res = await client.getMyProfile()
    expect(res.data.data.getMyProfile?.id).toBeTruthy()
    expect(res.data.data.getMyProfile.user.email).toEqual(user.email)
  })
  
  it('updates profile description', async () => {
    let res = await client.updateMyProfileDescription(profileDescription)
    expect(res.data.data.updateMyProfileDescription.description).toEqual(
      profileDescription,
    )
  })
})
