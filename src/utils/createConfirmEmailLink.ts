import { v4 } from 'uuid'
import { RedisClient } from 'redis'

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: RedisClient,
) => {
	const id = v4()
	await redis.set(id, userId, "ex", 60*60*12)
	return `${url}/confirm/${id}`
}
