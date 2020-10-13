import { AsyncRedis } from '../../types/server-utils'
import { userSessionIdPrefix, redisSessionPrefix } from '../constants'

const removeAllUserSessions = async (
  userId: string,
  asyncRedis: AsyncRedis,
): Promise<boolean> => {
  let success = false
  let allUserSessionIds: string[]
  allUserSessionIds = await asyncRedis('lrange', [
    userSessionIdPrefix + userId,
    0,
    -1,
  ])
  let errors = 0
  if (allUserSessionIds.length > 0) {
    allUserSessionIds.forEach(async (sessionId) => {
      let sessionDel = await asyncRedis('del', [redisSessionPrefix + sessionId])
      if (sessionDel === 0) {
        errors++
      }
    })
    let sessionList = await asyncRedis('del', [userSessionIdPrefix + userId])
    if (sessionList && !errors) success = true
  }
  return success
}

const loginUser = async (
  userId: string,
  session: Express.Session,
  asyncRedis: AsyncRedis,
): Promise<boolean> => {
  await asyncRedis('lrem', [userSessionIdPrefix + userId, 0, session.id])
  const res = await asyncRedis('lpush', [
    userSessionIdPrefix + userId,
    session.id,
  ])
  if (res === 1) {
    session.userId = userId
    return true
  }
  return false
}

const isLoggedIn = (session: Express.Session): boolean => {
  if (session.userId) {
    return true
  } else {
    return false
  }
}

const verifyLogin = async (
  session: Express.Session,
  asyncRedis: AsyncRedis,
): Promise<boolean> => {
  if (isLoggedIn(session)) {
    let userId = session.userId
    let sessionList = await asyncRedis('lrange', [
      userSessionIdPrefix + userId,
      0,
      -1,
    ])
    return Boolean(sessionList.find((e: string) => e === session.id))
  } else {
    return false
  }
}

export { removeAllUserSessions, loginUser, isLoggedIn, verifyLogin }
