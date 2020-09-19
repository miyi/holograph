import * as yup from 'yup'

const emailValidateSchema = yup.string().min(6).max(255).email()
const passwordValidateSchema = yup.string().min(6).max(255)

const emailPasswordSchema = yup.object().shape({
  email: emailValidateSchema,
  password: passwordValidateSchema
})

export {
  emailValidateSchema,
  passwordValidateSchema,
  emailPasswordSchema,
}



