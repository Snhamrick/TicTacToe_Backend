const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true},
    games: {type: Number, required: true, default: 0},
    wins: {type: Number, required: true, default: 0},
    losses: {type: Number, required: true, default: 0},
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

userSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return hash === this.hash;
}

userSchema.methods.addWin = async function() {
    this.wins++;
    this.games++;
    await this.save();
}

userSchema.methods.addLoss = async function() {
    this.losses++
    this.games++;
    await this.save();
}

userSchema.methods.addGame = async function() {
    this.games++;
    await this.save();
}

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000, 10)
    }, process.env.JWT_SECRET);
}

module.exports = mongoose.model('users', userSchema);