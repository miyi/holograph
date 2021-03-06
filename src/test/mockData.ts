import faker from 'faker'
import { Post } from '../entity/Post'
import { Tag } from '../entity/Tag'
import { User } from '../entity/User'
import { createPub } from '../models/pubModel'
import { CreatePubForm } from '../types/graphql'

const mockPassword = 'password1234'
const createMockUser = async (confirm = true) => {
  return await User.create({
    email: faker.internet.email(),
    password: mockPassword,
    confirm,
  }).save()
}

const createMockPostByUser = async (user: User) => {
  let { title, body } = createMockPostInput()
  return await Post.create({
    title,
    body,
    author: user,
  }).save()
}

const createMockPostInput = () => {
  const title = faker.random.words(4)
  const body = faker.random.words(10)
  return {
    title,
    body,
  }
}

const createMockTag = () => {
  const name = faker.random.word()
  return Tag.create({
    name,
  })
}

const createMockPubByUser = async (user: User) => {
  let createMockPubForm: CreatePubForm = {
    name: faker.random.words(2).replace(' ', ''),
    description: faker.lorem.sentence(),
  }
  return await createPub(createMockPubForm, user.id)
}

export {
  mockPassword,
  createMockUser,
  createMockPostByUser,
  createMockPostInput,
  createMockTag,
  createMockPubByUser,
}
