import { Server } from 'http'
import stringifyObject from 'stringify-object'
import { TestClient } from '../../test/testClient'
import { testServerSetup, testTeardown } from '../../test/testSetup'
let server: Server
let client: TestClient
const arrayNames = ['John', 'Harry', 'Mike', 'Tom']

const nameInput = {
  firstName: 'Ming',
  lastName: 'Yin',
}

const getFullNameString = `
  {
    getFullName(input: {
      firstName: "${nameInput.firstName}",
      lastName: "${nameInput.lastName}"
    })
  }
`
beforeAll(async () => {
  server = await testServerSetup()
  client = new TestClient()
})

afterAll(async () => {
  await testTeardown(server)
})

describe('axios tests', () => {
  it('axios getFullNameString', async () => {
    let res = await client.axiosInstance
      .post('/', {
        query: getFullNameString,
      })
      .catch((e) => {
        throw Error(e)
      })
    expect(res.data.data.getFullName).toEqual('Ming Yin')
  })
  it('axios helloAll array input test', async () => {
    let res = await client.axiosInstance.post('/', {
      query: `
        {
          helloAll(stringArray: ["John", "Harry", "Mike", "Tom"])
        }
      `,
    })
    expect(res.data.data.helloAll).toEqual('Hello John Harry Mike Tom!')
  })
  it('test stringify-object', async () => {
    let res = await client.axiosInstance
      .post('/', {
        query: `{
          getFullName(input: ${stringifyObject(nameInput, {
            singleQuotes: false,
          })})
        }`,
      })
      .catch((e) => {
        throw Error(e)
      })
    expect(res.data.data.getFullName).toEqual('Ming Yin')
    res = await client.axiosInstance.post('/', {
      query: `
        {
          helloAll(stringArray: ${stringifyObject(arrayNames, {
            singleQuotes: false,
          })})
        }
      `,
    })
    expect(res.data.data.helloAll).toEqual('Hello John Harry Mike Tom!')
  })
})
