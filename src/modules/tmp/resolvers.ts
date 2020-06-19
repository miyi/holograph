import { ResolverMap } from "../../types/graphql-utils";
import { QueryHelloArgs } from "../../types/graphql";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: QueryHelloArgs) => `Hello ${name || 'World'}`,
    url: (_: void, __: void, context: any) => {
      return context.url
    },
    readSessionDummy1: (_: void, __: void, context: any) => {
      console.log(context.session)
      return context.session.dummy1
    },
    readSessionDummy2: (_: void, __: void, context: any) => {
      return context.session.dummy2
    },
  },
  Mutation: {
    setSessionDummy1: (_: void, __: void, context: any) => {
      context.session.dummy1 = true
      return 'dummy1 set'
    },
    setSessionDummy2: (_: void, __: void, context: any) => {
      context.session.dummy2 = true
      return 'dummy2 set'
    },
  },
}
