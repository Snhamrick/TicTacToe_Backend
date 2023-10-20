const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = async(req, res, next) => {
    const newUser = new User();
    newUser.username = req.body.username;
    newUser.setPassword(req.body.password);
    try {
        await User.create(newUser);
        const token = newUser.generateJwt();
        return res.status(200).json({"token": token});
    } catch (err) {
         return res.status(500).json(err.message);
    }
}

const login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
             return res.status(500).json(err.message);
        }
        if (user) {
            const token = user.generateJwt();
             return res.status(200).json({"token": token});
        } else {
             return res.status(401).json(info);
        }
    }) (req, res);
}

module.exports = {
    register,
    login
}