// config/passport.ts
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import Account from './src/model/account.model';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_secret_key'
};

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
  try {
    const account = await Account.findById(jwt_payload.sub);
    if (account) return done(null, { ...jwt_payload, account });
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;