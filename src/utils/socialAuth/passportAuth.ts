import {
  Profile as GoogleProfile,
  VerifyCallback,
} from './../../../node_modules/@types/passport-google-oauth20/index.d'
import { Profile as TwitterProfile } from './../../../node_modules/@types/passport-twitter/index.d'
import { PassportStatic } from 'passport'
import { IStrategyOption, Strategy as TwitterStrategy } from 'passport-twitter'
import { socialLoginMissingEmail } from '../authErrors'
import {
  Strategy as GoogleStrategy,
  StrategyOptions as GoogleStrategyOptions,
} from 'passport-google-oauth20'
import { Users } from '../../entity/Users';

const twitterCbUrl = 'http://127.0.0.1:4000/auth/twitter/callback'
const googleCbUrl = 'http://127.0.0.1:4000/auth/google/callback'

const googleStrategyOptions: GoogleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: googleCbUrl,
}

const googleCallback = async (
  _: string,
  __: string,
  { emails, id }: GoogleProfile,
  cb: VerifyCallback,
) => {
  if (!emails) {
    let error = socialLoginMissingEmail('google')
    cb(error, null)
  } else {
    const email = emails[0].value
    const user = await Users.findOne({ where: { email } })
    if (user) {
      //user exists
      if (!user.googleId) {
        //merge accounts
        user.googleId = id
        user.save()
      }
    } else {
      //register user
      await Users.create({
        email,
        googleId: id,
      }).save()
    }
    cb(undefined, user)
  }
}

const twitterStrategyOptions: IStrategyOption = {
  consumerKey: process.env.TWITTER_API_KEY as string,
  consumerSecret: process.env.TWITTER_API_SECRET as string,
  callbackURL: twitterCbUrl,
  includeEmail: true,
}

const twitterCallback = async (
  _: string,
  __: string,
  { emails, id }: TwitterProfile,
  cb: (error: any, user?: any) => void,
) => {
  if (!emails) {
    const error = socialLoginMissingEmail('twitter')
    console.log('twitter error');
    cb(error, null)
  } else {
    const email = emails[0].value
    let user: Users | undefined = await Users.findOne({ where: { email } })
    if (user) {
      //user exists
      if (!user.twitterId) {
        //merge accounts
        user.twitterId = id
        user.save()
      }
    } else {
      //register user
      user = await Users.create({
        email,
        twitterId: id,
      }).save()
    }
    console.log('twitter success');
    cb(null, user)
  }
}

const passportConfig = (passport: PassportStatic) => {
  passport.use(new GoogleStrategy(googleStrategyOptions, googleCallback))
  passport.use(new TwitterStrategy(twitterStrategyOptions, twitterCallback))

  passport.serializeUser((user, cb) => {
    cb(undefined, user)
  })

  passport.deserializeUser((obj, cb) => {
    cb(undefined, obj)
  })
}

export { passportConfig }
