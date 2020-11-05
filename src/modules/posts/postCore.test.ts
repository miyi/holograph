import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'
import { Posts } from '../../entity/posts';

let client: TestClient
const email = 'jim@jim.com'
const password = 'password123'
let req_url: string
let user: any
let post: Posts
const postTitle1 = "typeorm insert"

beforeAll(async () => {
  await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TestClient(req_url)
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
		post = await Posts.create({
			title: postTitle1,
			author: user,
		}).save()
		expect(post.id).not.toBeNull()
	})
	it('getPostById test', async () => {
		let res = await client.getPostById(post.id)
		expect(res.data.data.getPostById.title).toEqual(postTitle1)
		expect(res.data.data.getPostById.author.email).toEqual(email)
	})
})