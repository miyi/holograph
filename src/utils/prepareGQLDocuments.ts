import { loadFiles } from '@graphql-toolkit/file-loading'
import { join } from 'path'
import { mergeResolvers, mergeTypeDefs } from '@graphql-toolkit/schema-merging'

const loadGQLDocs = () => {
  const typeDefDocs = loadFiles(join(process.cwd(), 'src', 'modules', '**/*.graphql'))
  const resolverDocs = loadFiles(join(process.cwd(), 'src', 'modules', '**/resolvers.ts'))
  return { typeDefDocs, resolverDocs }
}

const mergeGQLDocs = (
  typeDefDocs: Array<any>,
  resolverDocs: Array<any>,
) => {
  const resolvers = mergeResolvers(resolverDocs)
  const typeDefs = mergeTypeDefs(typeDefDocs)
  return { resolvers, typeDefs }
}

export const prepareGQLDocuments = () => {
  const { typeDefDocs, resolverDocs } = loadGQLDocs()
  const { resolvers, typeDefs } = mergeGQLDocs(typeDefDocs, resolverDocs)
  return { resolvers, typeDefs }
}
