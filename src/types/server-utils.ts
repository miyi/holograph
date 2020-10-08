import { Request, Response } from 'express'

interface AddressInfo {
  address: string
  family: string
  port: number
}

interface ContextIntegration {
  req: Request
  res: Response
}

interface AsyncRedis {
  (command: string, values: Array<number | string>): Promise<any>
}

export { ContextIntegration, AddressInfo, AsyncRedis }
