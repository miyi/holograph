import { Server } from 'http'
import { redis } from '../server_configs/redisServer'
import { startServer } from '../startServer'
const testServerSetup = async () => {
  const server = await startServer().catch(() => {
    throw Error('no url')
  })
  return server
}

const testTeardown = async (server: Server) => {
  server.close()
  await new Promise((resolve) => {
    redis.quit(() => {
      resolve(true)
    })
  })
}

export { testServerSetup, testTeardown }
