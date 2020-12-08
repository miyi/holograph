import faker from 'faker'
import { Posts } from '../entity/posts'
import { Users } from '../entity/Users'

const mockPassword = 'password1234'
const createMockUser = async (confirm = true) => {
  return await Users.create({
    email: faker.internet.email(),
    password: mockPassword,
    confirm,
  }).save()
}

const createMockPostByUser = async (user: Users) => {
  return await Posts.create({
    title: faker.random.words(4),
    author: user,
  }).save()
}

export { mockPassword, createMockUser, createMockPostByUser }
