import { userSessionIdPrefix, redisSessionPrefix } from "./constants"

export const removeAllUserSessions = async (userId: string, asyncRedis: any): Promise<boolean> => {
	let success = false
	let allUserSessionIds: string[]
	allUserSessionIds = await asyncRedis('lrange', [userSessionIdPrefix + userId, 0, -1])
	if(allUserSessionIds) {
		allUserSessionIds.forEach(async (sessionId) => {
			await asyncRedis('del', [`${redisSessionPrefix}${sessionId}`])
		})
		await asyncRedis('del', [userSessionIdPrefix + userId])
		success = true
	}
	return success
}