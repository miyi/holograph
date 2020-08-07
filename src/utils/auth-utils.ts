import { AuthError } from '../types/graphql'

const duplicateEmail: AuthError = {
  path: 'email',
  message: 'email already registered',
}

const emailError: AuthError = {
  path: 'email',
  message: 'incorrect email',
}

const confirmEmailError: AuthError = {
  path: 'email',
  message: 'please confirm email',
}

const passwordError: AuthError = {
  path: 'password',
  message: 'incorrect password',
}

const sessionUserError: AuthError = {
  path: 'session',
  message: 'user not found in session',
}

const sessionDestroyError: AuthError = {
  path: 'session',
  message: 'session could not be destroyed',
}

const sessionLremError: AuthError = {
  path: 'session',
  message: 'session not registered under user',
}

export {
  confirmEmailError,
  emailError,
  passwordError,
  duplicateEmail,
  sessionUserError,
  sessionDestroyError,
  sessionLremError,
}
