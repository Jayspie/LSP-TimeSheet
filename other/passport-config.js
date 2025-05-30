const LocalSTra = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getuserbyid, getuserbyId) {
  const authenticateUser = async (id, password, done) => {
    const user = getuserbyid(id);
    if (user == null) {
      return done(null, false, { message: "NO user with that email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return document(error);
    }
  };
  passport.use(new LocalSTra({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    done(null, getuserbyId(id));
  });
}

module.exports = initialize;
