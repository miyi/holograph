import { app, httpServer } from './server_configs/expressServer'
import { initApolloServer } from './server_configs/apolloServer'
import { AddressInfo } from './types/server-utils'
import { Server } from 'http'
import { createTypeormConnection } from './utils/createTypeormConnection'

export const startServer = (
  port: number = process.env.NODE_ENV === 'DEV' ? 4000 : 0,
  address: string = 'localhost',
): Promise<Server> =>
  new Promise<Server>(async (resolve) => {
    {
      await createTypeormConnection()
      initApolloServer(app)
      httpServer.listen(port, address, () => {
        process.env.HOST_URL =
          'http://' +
          (httpServer.address() as AddressInfo).address +
          ':' +
          (httpServer.address() as AddressInfo).port
        console.log('listening on: ', process.env.HOST_URL)
        resolve(httpServer)
      })
    }
  })
