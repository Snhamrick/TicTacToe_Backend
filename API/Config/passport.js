const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');


//New local strategy
passport.use(new LocalStrategy({
    usernameField: 'username'
},
async (username, password, done) => {
    try {
        const user = await User.findOne({username: username});  //locate user from database
        if (!user) {
            return done(null, false, {
                message: "Incorrect Username"
            });
        }
        if (!user.validPassword(password)) {                //validate password
            return done(null, false, {
                message: "Incorrect Password"
            });
        }
        return done(null, user);                        //return user if all pass
    } catch (err) {
        return done(err);
    }
}
));