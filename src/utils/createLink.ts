import { v4 } from 'uuid'
import { AsyncRedis } from '../types/server-utils'
import {
  confirmUserPrefix,
  forgotPasswordPrefix,
} from './constants'
import { removeAllUserSessions } from './auth-utils'

const createConfirmEmailLink = async (
  url: string,
  userId: string,
  asyncRedis: AsyncRedis,
): Promise<string> => {
  const id = v4()
  await asyncRedis('set', [confirmUserPrefix + id, userId, 'ex', 60 * 60 * 12])
  return `${url}/confirm/${id}`
}
const createForgotPasswordLink = async (
  url: string,
  userId: string,
  asyncRedis: AsyncRedis,
): Promise<string> => {
  const LinkId = v4()
  await asyncRedis('set', [
    forgotPasswordPrefix + LinkId,
    userId,
    'ex',
    60 * 15,
  ])
  await removeAllUserSessions(userId, asyncRedis)
  return `${url}/change-password/${LinkId}`
}

export { createConfirmEmailLink, createForgotPasswordLink }
