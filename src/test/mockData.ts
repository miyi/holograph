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
  let { title, body } = mockPostObject()
  return await Post.create({
    title,
    body,
    author: user,
  }).save()
}

const mockPostObject = () => {
  const title = faker.random.words(4)
  const body = faker.random.words(10)
  return {
    title,
    body,
  }
}

export { mockPassword, createMockUser, createMockPostByUser, mockPostObject }
