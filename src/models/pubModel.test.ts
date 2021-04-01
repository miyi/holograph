import { Server } from 'http'
import { createMockUser } from '../test/mockData'
import { testServerSetup, testTeardown } from '../test/testSetup'
import {
  createPub,
  lookUpPubsByName,
  getPubByName,
  addMod,
  getPubById,
  removeMod,
} from './pubModel'
import faker from 'faker'
import { Pub } from '../entity/Pub'
import { CreatePubForm } from '../types/graphql'

let server: Server
let user1: any
let user2: any
let pub1: any
let pubForm1: CreatePubForm = {
  name: faker.random.words(3),
  description: faker.lorem.words(20),
}
beforeAll(async () => {
  server = await testServerSetup()
  user1 = await createMockUser()
  user2 = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('pubModel tests', () => {
  it('create pub and getPubById', async () => {
    pub1 = await createPub(pubForm1, user1.id)
    expect(pub1.name).toEqual(pubForm1.name)
    let res = await getPubById(pub1.id)
    expect(res?.id).toEqual(pub1.id)
  })
  it('lookup and getPubByName', async () => {
    expect((await lookUpPubsByName(pubForm1.name))[0].id).toEqual(pub1.id)
    expect((await getPubByName(pubForm1.name))?.id).toEqual(pub1.id)
  })
  it('error: create pub no user', async () => {
    let res = await createPub(pubForm1, user1.id)
    expect((res as Error).message).toEqual('23505')
  })
  it('adds user2 to pub1 mod', async () => {
    let res = await addMod(pub1.id, user2.id)
    expect(res).toBeTruthy()
    let res2 = await Pub.findOne(pub1.id, {
      relations: ['mods'],
    })
    expect(res2?.mods[0].id).toEqual(user1.id)
    expect(res2?.mods[1].id).toEqual(user2.id)
  })
  it('removes user2 from pub1 mods', async () => {
    let res = await removeMod(pub1.id, user2.id)
    expect((res as Pub).id).toEqual(pub1.id)
    let res2 = await Pub.findOne(pub1.id, {
      relations: ['mods'],
    })
    expect(res2?.mods.length).toEqual(1)
  })
  it('removes user1 from pub1 mods', async () => {
    let res = await removeMod(pub1.id, user1.id)
    expect((res as Pub).id).toEqual(pub1.id)
    console.log((res as Pub).mods)
    let res2 = await Pub.findOne(pub1.id, {
      relations: ['mods'],
    })
    expect(res2?.mods).toEqual([])
  })
})
