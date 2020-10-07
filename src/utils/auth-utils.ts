import { AsyncRedis } from '../types/server-utils'
import { userSessionIdPrefix, redisSessionPrefix } from './constants'
// import { Users } from '../entity/Users'
// import { sendConfirmationEmail } from './sendEmail';

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

// const registerUserAndSendConfirmationEmail = async (
//   email: string,
//   password?: string | undefined,
//   twitterId?: string | undefined,
//   googleId?: string | undefined,
// ) => {
//   return await Users.create({
//     email,
//     password,
//     twitterId,
//     googleId
//   }).save()
// }

const loginUser = async (
  userId: string,
  session: Express.Session,
  asyncRedis: AsyncRedis,
): Promise<boolean> => {
  const res = await asyncRedis('lpush', [
    userSessionIdPrefix + userId,
    session.id,
  ])
  if (res === 1) {
    session.userId = userId
    return true
  } else {
    return false
  }
}

export { removeAllUserSessions, loginUser }
