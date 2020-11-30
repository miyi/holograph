import { Users } from '../entity/Users'
import faker from 'faker'
import { Posts } from '../entity/posts'

const mockPassword = 'password1234'
const createMockUser = async () => {
  let email = faker.internet.email()
  return await Users.create({
    email,
    password: mockPassword,
  }).save()
}

const createMockPostByUser = async (user: Users) => {
  let title = faker.random.words(2)
  return await Posts.create({
    title,
    author: user,
  })
}

export { mockPassword, createMockUser, createMockPostByUser }
