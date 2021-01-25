import * as yup from 'yup'

const emailValidateSchema = yup.string().min(6).max(255).email()
const passwordValidateSchema = yup.string().min(6).max(255)
const tagNameSchema = yup
  .string()
  .min(3)
  .max(32)
  .matches(/^[a-zA-Z0-9_]*$/)

const tagInputSchema = yup.object().shape({
  id: yup.string(),
  name: tagNameSchema.required(),
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
}
