import { Router, Response } from 'express'
import { createClient } from 'redis'
import { Users } from '../entity/Users'

const redisClient = createClient()

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
	const userId = await redisClient.get(id, function (value) { 
		
	})
	if (userId) {
		await Users.update({ id: userId }, { confirm: true })
		await redisClient.del(id)
		res.send('ok')
	} else {
		res.send('invalid')
	}
})