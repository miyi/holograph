import { Router, Response } from 'express'
import { redis } from '../redisServer'
import { Users } from '../entity/Users'

const routes: Router = Router()

routes.get('/', (_, res: Response) => {
	res.status(200).send('home')
})

routes.get('/test', (_, res: Response) => {
	res.status(200).send('fetch received')
})

export { routes }

routes.get('/confirm/:id', async (req, res) => {
	const { id } = req.params
	await redis.get(id, async (_, reply) => {
		const userId = reply
		if (userId) {
			await Users.update({ id: userId }, { confirm: true })
			await redis.del(id)
			res.send('ok')
		} else {
			res.send('invalid')
		}
	})
	
})
