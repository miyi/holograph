import faker from 'faker'
import { Post } from '../entity/Post'
import { User } from '../entity/User'

const mockPassword = 'password1234'
const createMockUser = async (confirm = true) => {
  return await User.create({
    email: faker.internet.email(),
    password: mockPassword,
    confirm,
  }).save()
}

const createMockPostByUser = async (user: User) => {
  return await Post.create({
    title: faker.random.words(4),
    author: user,
  }).save()
}

export { mockPassword, createMockUser, createMockPostByUser }
