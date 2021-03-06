import * as yup from 'yup'
import { tag_max_num } from './constants'

const password_min_length = 7
const password_max_length = 128
const tag_name_min = 3
const tag_name_max = 32

const emailValidateSchema = yup.string().min(6).max(255).email()
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
  title: yup.string(),
  body: yup.string(),
})

const emailPasswordSchema = yup.object().shape({
  email: emailValidateSchema,
  password: passwordValidateSchema,
})

export {
  emailValidateSchema,
  passwordValidateSchema,
  emailPasswordSchema,
  tagNameSchema,
  tagInputSchema,
  postFormSchema,
}
