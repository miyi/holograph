import { PassportStatic } from 'passport'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { socialLoginMissingEmail } from '../authErrors'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Users } from '../../entity/Users'

const twitterCbUrl = 'http://127.0.0.1:4000/auth/twitter/callback'
const googleCbUrl = 'http://127.0.0.1:4000/auth/google/callback'

const passportConfig = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: googleCbUrl,
      },
      async (_, __, profile, cb) => {
        const { emails, id } = profile
        let error: Error = {
          name: 'no error',
          message: '',
        }
        if (emails) {
          let email = emails[0].value
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
          return cb(undefined, user)
        } else {
          error = socialLoginMissingEmail('google')
          return cb(error, null)
        }
      },
      // async (_, __, profile, cb) => {
      //   return cb(undefined, profile)
      // }
    ),
  )
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_API_KEY as string,
        consumerSecret: process.env.TWITTER_API_SECRET as string,
        callbackURL: twitterCbUrl,
        includeEmail: true,
      },
      async (_, __, profile, cb) => {
        const { emails, id } = profile
        if (emails) {
          const email = emails[0].value
          const user = await Users.findOne({ where: { email } })
          if (user) {
            //user exists
            if (!user.twitterId) {
              //merge accounts
              user.twitterId = id
              user.save()
            }
            return cb(null, user)
          } else {
            //register user
            await Users.create({
              email,
              twitterId: id,
            }).save()
          }
          return cb(null, user)
        } else {
          const error = socialLoginMissingEmail('twitter')
          return cb(error, null)
        }
      },
    ),
  )

  passport.serializeUser((user, cb) => {
    cb(undefined, user)
  })

  passport.deserializeUser((obj, cb) => {
    cb(undefined, obj)
  })
}

export { passportConfig }
