import { ValidationError } from 'yup'

export const formatYupErr = (err: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = []
  err.inner.forEach(err => {
    errors.push({
      path: err.path,
      message: err.message,
    })
  })

  return errors
}
 