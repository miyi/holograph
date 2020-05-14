import * as yup from 'yup'

export const emailPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .min(6)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(6)
    .max(255),
})