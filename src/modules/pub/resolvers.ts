import {
  isLoggedInMiddleware,
  isModeratorMiddleware,
} from './../../models/auth/authMiddleware'
import { Pub } from '../../entity/Pub'
import { ResolverMap } from '../../types/graphql-utils'
import {
  QueryGetPubByIdArgs,
  QueryLookUpPubsByNameArgs,
  QueryGetPubByNameArgs,
  MutationCreatePubArgs,
} from '../../types/graphql'
import {
  addMod,
  createPub,
  getPubById,
  getPubByName,
  lookUpPubsByName,
  removeMod,
} from '../../models/pubModel'
import { createPubFormSchema, pubNameSchema } from '../../utils/yupValidate'
import { createMiddleware } from '../../utils/createMiddleware'
import { UserInputError, ApolloError } from 'apollo-server-express'
import { userInputError } from '../../utils/errorMessage/resolverErrorMessages'
import { MutationAddModArgs, MutationRemoveModArgs } from '../../types/graphql'
export const resolvers: ResolverMap = {
  Query: {
    getPubById: async (_, { id }: QueryGetPubByIdArgs) => {
      return await getPubById(id)
    },
    lookUpPubsByName: async (_, { name }: QueryLookUpPubsByNameArgs) => {
      name = name.replace(' ', '')
      try {
        pubNameSchema.validate(name)
      } catch {
        return null
      }
      return await lookUpPubsByName(name)
    },
    getPubByName: async (_, { name }: QueryGetPubByNameArgs) => {
      name = name.replace(' ', '')
      try {
        pubNameSchema.validate(name)
      } catch {
        return null
      }
      return await getPubByName(name)
    },
  },
  Mutation: {
    createPub: createMiddleware(
      isLoggedInMiddleware,
      async (_, { form }: MutationCreatePubArgs, { session }) => {
        form.name = form.name.replace(' ', '')
        try {
          createPubFormSchema.validate(form)
        } catch {
          throw new UserInputError(userInputError)
        }
        let modelRes = await createPub(form, session.userId)
        if (modelRes instanceof Error) {
          throw new ApolloError(modelRes.message)
        }
        return modelRes
      },
    ),

    addMod: createMiddleware(
      isModeratorMiddleware,
      async ({ pub }, { userId }: MutationAddModArgs) => {
        console.log('addMod running')
        let modelRes = await addMod(pub, userId)
        console.log(modelRes)
        if (modelRes instanceof Error) {
          throw new ApolloError(modelRes.message)
        }
        return modelRes
      },
    ),
    removeMod: createMiddleware(
      isModeratorMiddleware,
      async ({ pub }, { userId }: MutationRemoveModArgs) => {
        let modelRes = await removeMod(pub, userId)
        if (modelRes instanceof Error) {
          throw new ApolloError(modelRes.message)
        }
        return modelRes
      },
    ),
  },
  Pub: {
    info: async (parent) => {
      let pubInfoLJoin = await Pub.findOne(parent.id, {
        relations: ['info'],
      })
      return pubInfoLJoin?.info
    },
    mods: async (parent) => {
      let pubModsLJoin = await Pub.findOne(parent.id, {
        relations: ['mods'],
      })
      return pubModsLJoin?.mods
    },
  },
}
