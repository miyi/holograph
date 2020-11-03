import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
// import { TestClient } from '../../test/testClient'
import { Posts } from '../../entity/posts';

// let client: TestClient
const email = 'jim@jim.com'
const password = 'password123'
// let req_url: string
let user: any

beforeAll(async () => {
  await startServer()
  if (process.env.HOST_URL) {
    // req_url = process.env.HOST_URL + '/graphql'
    // client = new TestClient(req_url)
  } else {
    throw Error('no url')
	}
})

describe('postCore tests', () => {
	it('creates user', async () => {
		user = await Users.create({
			email,
			password,
		}).save()
		expect(user.id).not.toBeNull()
	})
	it('creates and retrieves posts directly from typeorm', async() => {
		let post = await Posts.create({
			title: "typeorm insert",
			author: user,
		}).save()
		expect(post.id).not.toBeNull()
	})
})