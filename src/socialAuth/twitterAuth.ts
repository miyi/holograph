// import * as passport from 'passport'
// import { Strategy as TwitterStrategy } from 'passport-twitter'

// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_API_KEY as string,
//       consumerSecret: process.env.TWITTER_API_SECRET as string,
// 			callbackURL: 'http://localhost:4000/auth/twitter/callback',
// 			includeEmail: true,
//     },
//     (token, tokenSecret, profile, cb) => {
//       User.findOrCreate({ twitterId: profile.id }, function (err, user) {
//         return cb(err, user)
//       })
//     },
//   ),
// )
