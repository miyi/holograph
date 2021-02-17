import { User } from '../../entity/User'
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
    if (userId) {
      let sessionList = await asyncRedis('lrange', [
        userSessionIdPrefix + userId,
        0,
        -1,
      ])
      //check if sessionId exists in sessionList
      if (
        sessionList &&
        Boolean(sessionList.find((e: string) => e === session.id))
      ) {
        //check if session.userId actually has a user
        let user = await User.findOne(userId)
        if (user?.email) {
          return true
        }
        //if no user found remove all session related to userId
        await removeAllUserSessions(userId, asyncRedis)
      }
      session.userId = null
    }
  }
  return false
}

export { removeAllUserSessions, loginUser, isLoggedIn, verifyLogin }
