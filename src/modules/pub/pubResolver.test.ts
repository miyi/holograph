import stringifyObject from 'stringify-object'
import { Server } from 'http'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import { TestClient } from '../../test/testClient'
import { createMockPubByUser, createMockUser, mockPassword } from '../../test/mockData'
import { CreatePubForm } from '../../types/graphql'
import { notLoggedIn } from '../../utils/errorMessage/AuthErrors'

let server: Server
let client: TestClient
let user1: any
let user2: any
let pub1: any
const createNewPubForm: CreatePubForm = {
		name: 'foobarCommunity',
		description: 'hello world!',

}
const createNewPubFormString = stringifyObject(createNewPubForm, {
	singleQuotes: false
})

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
  user1 = await createMockUser()
  pub1 = await createMockPubByUser(user1)
	user2 = await createMockUser()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('pub resolver test', () => {
  it('get by id', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
				{
					getPubById(id: "${pub1.id}") {
						id
						mods {
							email
						}
					}
				}
			`,
    })
    expect(res.data.data.getPubById.id).toEqual(pub1.id)
    expect(res.data.data.getPubById.mods[0].email).toEqual(user1.email)
  })
  it('lookup by name', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
				{
					lookUpPubsByName(name: "${pub1.name}") {
						id
						mods {
							email
						}
					}
				}
			`,
    })
    expect(res.data.data.lookUpPubsByName[0].mods[0].email).toEqual(user1.email)
  })
  it('get pub by name', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
				{
					getPubByName(name: "${pub1.name}") {
						id
					}
				}
			`,
    })
    expect(res.data.data.getPubByName.id).toEqual(pub1.id)
  })


  it('creates a new pub not logged in', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
				mutation {
					createPub(form: ${createNewPubFormString}) {
						id
						name
						description
					}
				}
			`,
    })
    expect(res.data.errors[0].message).toEqual(notLoggedIn)
  })
	it('logs in then creates pub', async () => {
		await client.login(user1.email, mockPassword)
		let res = await client.createPub(createNewPubForm)
		expect(res.data.data.createPub.name).toEqual(createNewPubForm.name)
	})
	it('adds user2 to mod', async () => {
		let res = await client.axiosInstance.post('/', {
			query: `
				mutation {
					addMod(pubId: "${pub1.id}",userId: "${user2.id}") {
						id
					}
				}
			`
		})
		console.log(res.data);
		expect(res.data.data.addMod.id).toEqual(pub1.id)
	})

	it('removes user2 from mod', async () => {
		let res = await client.axiosInstance.post('/', {
			query: `
				mutation {
					removeMod(pubId: "${pub1.id}", userId: "${user1.id}") {
						id
					}
				}
			`
		})
		expect(res.data.data.removeMod.id).toEqual(pub1.id)
	})
})
