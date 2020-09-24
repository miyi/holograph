import { getConnectionOptions, createConnection } from 'typeorm'

export const createTypeormConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV)
  return createConnection({ ...connectionOptions, name: "default" })
}
//typeorm for some reason looks for a connection named "default" when making a query