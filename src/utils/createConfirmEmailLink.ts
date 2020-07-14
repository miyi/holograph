import { v4 } from 'uuid'

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: any,
) => {
	const id = v4()
	await redis('set', [id, userId, "ex", 60*60*12])
	return `${url}/confirm/${id}`
}
