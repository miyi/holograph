// import { Server } from 'http'
import { createQueryBuilder } from 'typeorm'
import { Posts } from '../../../entity/posts'
import { Users } from '../../../entity/Users'
import { startServer } from '../../../startServer'
import { TmpTestClient } from '../../../test/tmpTestClient'

// let server: Server
let req_url: string
let client: any
let user: Users
const postTitle = 'fake title'
const email = 'jim@jim.com'
const password = 'password123'

beforeAll(async () => {
  await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TmpTestClient(req_url)
    user = await Users.create({
      email,
      password,
      confirm: true,
    }).save()
  } else {
    throw Error('no url')
  }
})

// afterAll(() => {
//   server.close()
// })

describe('test resolver chain  setup', () => {
  it('calls the library, book, author n+1 query', async () => {
    let reply = await client.libraries()
    expect(reply.data.data.libraries.length).toBeGreaterThan(0)
  }),
    it('typeorm gets posts from user', async () => {
      await Posts.create({
        title: postTitle,
        author: user,
      }).save()

      const directGetUsers = await createQueryBuilder('users').getOne()
      const directGetPosts = await createQueryBuilder('posts').getOne()

      expect((directGetUsers as Users).id).toEqual(user.id)
      console.log(directGetPosts)

      const userPosts = await Users.findOne({
        relations: ['posts'],
        where: {
          id: user.id,
        },
      })
      console.log(userPosts?.posts)

      const postsFromUser = await Posts.find({
        author: {
          id: user.id,
        },
      })
      expect(postsFromUser.length).toBeGreaterThan(0)
    })
})