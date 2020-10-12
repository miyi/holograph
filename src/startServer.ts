import { Server } from 'http'
import { initApolloServer } from './server_configs/apolloServer'
import { createTypeormConnection } from './server_configs/createTypeOrmConnection'
import { createExpressApp } from './server_configs/expressServer'
import { AddressInfo } from './types/server-utils'

export const startServer = (
  port: number = process.env.NODE_ENV === 'DEV' ? 4000 : 0,
  address: string = 'localhost',
): Promise<Server> =>
  new Promise<Server>(async (resolve) => {
    await createTypeormConnection()
    const app = createExpressApp()
    initApolloServer(app)
    const httpServer = app.listen(port, address, () => {
      process.env.HOST_URL =
        'http://' +
        (httpServer.address() as AddressInfo).address +
        ':' +
        (httpServer.address() as AddressInfo).port
      console.log('listening on: ', process.env.HOST_URL)
      resolve(httpServer)
    })
  })
