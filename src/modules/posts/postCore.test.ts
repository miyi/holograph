import { Users } from '../../entity/Users'
import { startServer } from '../../startServer'
import { TestClient } from '../../test/testClient'
import { Posts } from '../../entity/posts'
import { Server } from 'http'
import { redis } from '../../server_configs/redisServer'

let server: Server
let client: TestClient
const email = 'jim@jim.com'
const password = 'password123'
let req_url: string
let user: any
let post: Posts
const postTitle1 = 'typeorm insert'

beforeAll(async () => {
  server = await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TestClient(req_url)
  } else {
    throw Error('no url')
  }
})

afterAll(async () => {
	await server.close()
	await new Promise((resolve) => {
		redis.quit(() => {
				resolve();
		});
});
})

describe('postCore tests', () => {
  it('creates user and post', async () => {
    user = await Users.create({
      email,
      password,
    }).save()
    expect(user.id).not.toBeNull()
    post = await Posts.create({
      title: postTitle1,
      author: user,
    }).save()
    expect(post.id).not.toBeNull()
  })
  it('getPostById test', async () => {
    let res = await client.getPostById(post.id)
    expect(res.data.data.getPostById.title).toEqual(postTitle1)
  })
  it('typeorm gets author from post', async () => {
    let res = await Posts.findOne({
      relations: ['author'],
      where: {
        id: post.id,
      },
    })
    expect(res?.author.id).toEqual(user.id)
  })
  it('typeorm gets author from post using queryBuilder', async () => {
    let res = await Posts.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'users')
			.getMany()
		expect(res.length).toBeGreaterThan(0)
		expect(res[0].id).toEqual(post.id)
		expect(res[0].author.id).toEqual(user.id)
	})
	it('get posts by id', async() => {
		let res = await client.axiosInstance.post('/', {
			query: `{
				getPostById(id: "${post.id}") {
					id
					author {
						email
					}
				}
			}`
		})
		console.log(res.data.data);
	})
})
