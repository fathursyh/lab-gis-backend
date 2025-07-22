import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { validatePassword } from '../models/userModel';

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async function verify(email, password, cb,) {
  const user = await User.findOne({ where: { email: email } }).then(data => data?.dataValues);
  if (!user) return cb(null, false, { message: "Incorrect username or password." });
  const isMatch = validatePassword(password, user.password);
  if (!isMatch) return cb(null, false, { message: "Incorrect username or password." });
  return cb(null, user);
}));

export default passport;