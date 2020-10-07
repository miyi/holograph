import { userSessionIdPrefix, redisSessionPrefix } from './constants'
import { AsyncRedis } from '../redisServer'

export const removeAllUserSessions = async (
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
  console.log('allUserSessionIds: ', allUserSessionIds)
  if (allUserSessionIds) {
    allUserSessionIds.forEach(async (sessionId) => {
      let sessionDel = await asyncRedis('del', [
        `${redisSessionPrefix}${sessionId}`,
      ])
      console.log('sessionid: ', sessionId)
      console.log('sessionDel: ', sessionDel)
    })
    let sessionList = await asyncRedis('del', [userSessionIdPrefix + userId])
    console.log('sessionList: ', sessionList)
    success = true
  }
  return success
}
