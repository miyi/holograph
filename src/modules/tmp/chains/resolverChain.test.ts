// import { Server } from 'http'
import { createQueryBuilder } from 'typeorm'
import { Post } from '../../../entity/Post'
import { User } from '../../../entity/User'
import { startServer } from '../../../startServer'
import { TmpTestClient } from '../../../test/tmpTestClient'

// let server: Server
let req_url: string
let client: any
let user: User
const postTitle = 'fake title'
const email = 'jim@jim.com'
const password = 'password123'

beforeAll(async () => {
  await startServer()
  if (process.env.HOST_URL) {
    req_url = process.env.HOST_URL + '/graphql'
    client = new TmpTestClient(req_url)
    user = await User.create({
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
      await Post.create({
        title: postTitle,
        author: user,
      }).save()

      const directGetUsers = await createQueryBuilder('users').getOne()
      const directGetPosts = await createQueryBuilder('posts').getOne()

      expect((directGetUsers as Users).id).toEqual(user.id)
      console.log(directGetPosts)

      const userPosts = await User.findOne({
        relations: ['posts'],
        where: {
          id: user.id,
        },
      })
      console.log(userPosts?.posts)

      const postsFromUser = await Post.find({
        author: {
          id: user.id,
        },
      })
      expect(postsFromUser.length).toBeGreaterThan(0)
    })
})
