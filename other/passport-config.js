//const LocalSTra = require("passport-local").Strategy;
import { Strategy as LocalSTra } from "passport-local";
import bcrypt from "bcrypt";

export default function initialize(passport, getuserbyadmin_id, getuserbyId) {
  const authenticateUser = async (admin_id, password, done) => {
    const user = await getuserbyadmin_id(admin_id);
    if (user == null) {
      return done(null, false, { message: "User not found" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new LocalSTra({ usernameField: "admin_id" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.admin_id));
  passport.deserializeUser((admin_name, done) => {
    return done(null, getuserbyId(admin_name));
  });
}

//module.exports = initialize;
