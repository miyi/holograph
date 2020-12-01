import { Users } from '../entity/Users'
import faker from 'faker'
import { Posts } from '../entity/posts'
import { getConnection } from 'typeorm'

const mockPassword = 'password1234'
const createMockUser = async (confirm = true) => {
  const connection = await getConnection()
  let email = faker.internet.email()
  console.log('email: ', email)
  let user = await Users.create({
    email,
    password: mockPassword,
    confirm,
  }).save()
  let res = await connection.manager.save(user)
  return res
}

const createMockPostByUser = async (user: Users) => {
  const connection = await getConnection()
  let title = faker.random.words(4)
  console.log('title: ', title)
  let post = await Posts.create({
    title,
    author: user,
  }).save()
  let res = await connection.manager.save(post)
  return res
}

export { mockPassword, createMockUser, createMockPostByUser }
