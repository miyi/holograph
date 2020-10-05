import { Router, Response } from 'express'
import { asyncRedis } from '../server_configs/redisServer'
import { Users } from '../entity/Users'
import { confirmUserPrefix } from '../utils/constants'
import { loginUser } from '../utils/auth-utils'
import passport from 'passport'

const routes: Router = Router()

routes.get('/', (_, res: Response) => {
  res.status(200).send('home')
})

routes.get('/test', (_, res: Response) => {
  res.status(200).send('fetch received')
})

routes.get('/failure', (_, res) => {
  res.send('login failed')
})

routes.get('/confirm/:id', async (req, res) => {
  const { id } = req.params

  const userId = await asyncRedis('get', [confirmUserPrefix + id])
  if (userId) {
    await Users.update({ id: userId }, { confirm: true })
    await asyncRedis('del', [confirmUserPrefix + id])
    res.send('ok')
  } else {
    res.send('invalid')
  }
})

routes.get('/auth/twitter', passport.authenticate('twitter'))
routes.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/failure',
    session: false,
  }),
  async (req, res) => {
    const session = req.session
    const userId = (req.user as any).id

    if (userId && session) {
      const success: boolean = await loginUser(userId, session, asyncRedis)
      if (success) {
        res.send('twitter login success')
      } else {
        res.send('twitter login failed')
      }
    } else {
      if (!session && !userId) {
        res.send('no session or userId')
      } else if (!session) {
        res.send('no session')
      } else {
        res.send(req.user)
      }
    }
  },
)

routes.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

routes.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failure' }),
  async (req, res) => {
    const session = req.session
    const userId = (req.user as any).id

    if (userId && session) {
      const success: boolean = await loginUser(userId, session, asyncRedis)
      if (success) {
        res.send('google login success')
      } else {
        res.send('google login failed')
      }
    } else {
      if (!session && !userId) {
        res.send('no session or userId')
      } else if (!session) {
        res.send('no session')
      } else {
        res.send(req.user)
      }
    }
  },
)

export { routes }
