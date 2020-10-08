import { userSessionIdPrefix, redisSessionPrefix } from './constants'
import { AsyncRedis } from '../redisServer'

const removeAllUserSessions = async (
  userId: string,
  asyncRedis: AsyncRedis,
): Promise<boolean> => {
  let success = false
  let allUserSessionIds: string[]
  console.log('removeAllUserSessions Called')
  allUserSessionIds = await asyncRedis('lrange', [
    userSessionIdPrefix + userId,
    0,
    -1,
  ])
  console.log('allUserSessionIds: ', allUserSessionIds)
  let errors = 0
  if (allUserSessionIds.length > 0) {
    allUserSessionIds.forEach(async (sessionId) => {
      let sessionDel = await asyncRedis('del', [redisSessionPrefix + sessionId])
      console.log('sessionId: ', sessionId)
      console.log('sessionDel: ', sessionDel)
      if (sessionDel === 0) {
        errors++
      }
    })
    let sessionList = await asyncRedis('del', [userSessionIdPrefix + userId])
    console.log('sessionList: ', sessionList)
    if (sessionList && !errors) success = true
  }
  return success
}

const loginUser = async (
  userId: string,
  session: Express.Session,
  asyncRedis: AsyncRedis,
): Promise<boolean> => {
  // await asyncRedis('lrem', [
  //   userSessionIdPrefix + userId,
  //   session.id,
  // ])
  const res = await asyncRedis('lpush', [
    userSessionIdPrefix + userId,
    session.id,
  ])
  console.log('lpush sessionId to user: ', session.id)
  console.log('lpush sessionId to user success: ', res)
  if (res === 1) {
    session.userId = userId
    return true
  }
  return false
}

export { removeAllUserSessions, loginUser }
