import { Like } from 'typeorm/find-options/operator/Like'
import { Pub } from '../entity/Pub'
import { User } from '../entity/User'
import { CreatePubForm } from '../types/graphql'
import {
  genericError,
  noPubError,
  noUserError,
} from '../utils/errorMessage/resolverErrorMessages'

const getPubById = async (pubId: string) => {
  return await Pub.findOne(pubId)
}

const lookUpPubsByName = async (name: string) => {
  return await Pub.find({
    where: {
      name: Like(`%${name}%`),
    },
  })
}

const getPubByName = async (name: string) => {
  return await Pub.findOne({
    where: {
      name,
    },
  })
}

const createPub = async (form: CreatePubForm, userId: string) => {
  let user = await User.findOne(userId)
  if (user) {
    return await Pub.create({
      ...form,
      mods: [user],
    })
      .save()
      .catch((e) => new Error(e.code))
  } else {
    return new Error(noUserError)
  }
}

const addMod = async (pub: Pub, userId: string) => {
  let user = await User.findOne(userId)
  if (pub && user) {
    pub.mods.push(user)
    return await pub.save().catch((e) => {
      return new Error(e.code)
    })
  }
  if (!pub) return new Error(noPubError)
  if (!user) return new Error(noUserError)
  return new Error(genericError)
}

const removeMod = async (pub: Pub, userId: string) => {
  if (pub) {
    pub.mods = pub.mods.filter((mod) => mod.id !== userId)
    return await pub.save().catch((e) => {
      return new Error(e.code)
    })
  }
  if (!pub) return new Error(noPubError)
  return new Error(genericError)
}

export {
  getPubById,
  lookUpPubsByName,
  getPubByName,
  createPub,
  addMod,
  removeMod,
}
