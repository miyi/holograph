import { Server } from "http"
import { Pub } from "../entity/Pub"
import { createMockUser } from "../test/mockData"
import { testServerSetup, testTeardown } from "../test/testSetup"

let server: Server
let user1: any

beforeAll(async () => {
  server = await testServerSetup()
  user1 = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('pub typeorm tests', () => {
	it('creates a pub', async () => {
		let res = await Pub.create({
			name: 'first pub',
			mods: [user1]
		}).save()
		let pub = Pub.findOne(res.id)
		expect(pub).toBeTruthy()
	})
})