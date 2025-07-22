import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import User, { validatePassword } from '../models/userModel';

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async function verify(email, password, cb,) {
  const user = await User.findOne({ where: { email: email } }).then(data => data?.dataValues);
  if (!user) return cb(null, false, { message: "Incorrect username or password." });
  const isMatch = validatePassword(password, user.password);
  if (!isMatch) return cb(null, false, { message: "Incorrect username or password." });
  return cb(null, user);
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'kerens-banget1',
  ignoreExpiration: false,

}, (payload, done) => {
  console.log(payload)
  return done(null, true);
}));

export default passport;