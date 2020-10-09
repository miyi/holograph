import { AuthError } from '../types/graphql'

const alreadyLoggedIn: AuthError = {
  path: 'session',
  message: 'already logged in',
}

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

const createCustomSessionError = (message: string): AuthError => {
  return {
    path: 'session',
    message: message,
  }
}

const socialLoginMissingEmail = (authServer: string): Error => {
  return {
    name: `${authServer} auth error`,
    message: `we can't find an email associated with this ${authServer} account`,
  }
}

export {
  alreadyLoggedIn,
  confirmEmailError,
  emailError,
  passwordError,
  duplicateEmail,
  sessionUserError,
  sessionDestroyError,
  sessionLremError,
  createCustomSessionError,
  socialLoginMissingEmail,
}
