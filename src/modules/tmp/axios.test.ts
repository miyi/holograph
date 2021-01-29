import { Server } from 'http'
import { testServerSetup, testTeardown } from '../../test/testSetup'
import { TestClient } from '../../test/testClient'
import { inspect } from 'util'
let server: Server
let client: TestClient
jest.setTimeout(3 * 60 * 1000)

// const readSession = `
// 	query {
//   	readSessionDummy1
// 	}
// `

// doesn't work
// const getFullNameObj = `
//   {
//     getFullName(input: ${JSON.stringify(nameInput)})
//   }
// `

beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('axios tests', () => {
  it('getFullNameString direct input', async () => {
    const getFullNameString = `
      {
        getFullName(input: {
          firstName: "Ming",
          lastName: "Yin"
        })
      }
    `
    let res = await client.axiosInstance
      .post('/', {
        query: getFullNameString,
      })
      .catch((e) => {
        throw Error(e)
      })
    expect(res.data.data.getFullName).toEqual('Ming Yin')
  })
  it('getFullNameString input as var', async () => {
    const nameInput = {
      firstName: 'Ming',
      lastName: 'Yin',
    }

    console.log(inspect(nameInput))

    const getFullNameString = `
      {
        getFullName(input: ${inspect(nameInput)})
      }
    `
    let res = await client.axiosInstance
      .post('/', {
        query: getFullNameString,
      })
      .catch((e) => {
        throw Error(e)
      })
    expect(res.data.data.getFullName).toEqual('Ming Yin')
  })
  it('returnArray direct input', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
        {
          returnArray(stringArray: ["John", "Harry", "Mike", "Tom"])
        }
      `,
    })
    expect(res.data.data.helloAll).toEqual('John Harry Mike Tom')
  })
  it('returnArray variable input', async () => {
    const arrayNames = ['John', 'Harry', 'Mike', 'Tom']
    console.log(inspect(arrayNames))
    let res = await client.axiosInstance.post('/', {
      query: `
        {
          returnArray(stringArray: ${inspect(arrayNames)})
        }
      `,
    })
    expect(res.data.data.helloAll).toEqual('John Harry Mike Tom')
  })
})
