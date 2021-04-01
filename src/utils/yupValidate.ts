import * as yup from 'yup'
import { tag_max_num } from './constants'

const email_min = 6
const email_max = 64
const password_min_length = 8
const password_max_length = 128
const tag_name_min = 3
const tag_name_max = 16
const post_title_min = 4
const pub_name_min = 3
const pub_name_max = 32

const emailValidateSchema = yup.string().min(email_min).max(email_max).email()
const passwordValidateSchema = yup
  .string()
  .min(password_min_length)
  .max(password_max_length)
const tagNameSchema = yup
  .string()
  .min(tag_name_min)
  .max(tag_name_max)
  .matches(/^[a-zA-Z0-9_]*$/)

const tagInputSchema = yup
  .array()
  .of(
    yup.object().shape({
      id: yup.string(),
      name: tagNameSchema.required(),
    }),
  )
  .max(tag_max_num)

const postFormSchema = yup.object().shape({
  title: yup.string().min(post_title_min),
  body: yup.string(),
})

const emailPasswordSchema = yup.object().shape({
  email: emailValidateSchema,
  password: passwordValidateSchema,
})

const pubNameSchema = yup.string().min(pub_name_min).max(pub_name_max)

const createPubFormSchema = yup.object().shape({
  name: pubNameSchema,
  description: yup.string().nullable(true),
})

export {
  emailValidateSchema,
  passwordValidateSchema,
  emailPasswordSchema,
  tagNameSchema,
  tagInputSchema,
  postFormSchema,
  pubNameSchema,
  createPubFormSchema,
}
