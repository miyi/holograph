import { userSessionIdPrefix, redisSessionPrefix } from "./constants"
import { AsyncRedis } from "../types/server-utils"

const removeAllUserSessions = async (userId: string, asyncRedis: AsyncRedis): Promise<boolean> => {
	let success = false
	let allUserSessionIds: string[]
	allUserSessionIds = await asyncRedis('lrange', [userSessionIdPrefix + userId, 0, -1])
	if(allUserSessionIds.length > 0) {
		allUserSessionIds.forEach(async (sessionId) => {
			await asyncRedis('del', [redisSessionPrefix + sessionId])
		})
		await asyncRedis('del', [userSessionIdPrefix + userId])
		success = true
	}
	return success
}

export { removeAllUserSessions }