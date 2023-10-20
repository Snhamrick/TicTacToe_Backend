const passport = require('passport');
const mongoose = require('mongoose');
const Users = require('../Models/Users');
const User = mongoose.model('users');

const getCurrentUser = async (req, res) => {
    if (req.auth) {
        try {
            const activeUser = await Users.findOne({username: req.auth.username})
            if (!activeUser) {
                return res.status(401).json({"message": "Unable to establish user"});
            } else {
                return res.status(200).json({username: activeUser.username, games: activeUser.games, wins: activeUser.wins, losses: activeUser.losses});
            }
        } catch(err) {
            return res.status(500).json(err.message);
        }
    } else {
        return res.status(401).json({"message": "No Authorization"});
    }
}

const addUserWin = async (req, res) => {
    if (req.body.username) {
        try {
            const activeUser = await Users.findOne({username: req.body.username});
            console.log(activeUser);
            if (activeUser) {
                await activeUser.addWin();
                console.log(activeUser);
                return res.status(200).json({"message": "win updated"});
            } else {
                return res.status(401).json({"message": "Unable to establish user"});
            }
        } catch (err) {
            return res.status(401).json({"message": err.message});
        }
    }
}

const addUserLoss =  async (req, res) => {
    if (req.body.username) {
        try {
            const activeUser = await Users.findOne({username: req.body.username});
            if (activeUser) {
                activeUser.addLoss();
                return res.status(200).json({"message": "loss updated"});
            } else {
                return res.status(401).json({"message": "Unable to establish user"});
            }
        } catch (err) {
            return res.status(401).json({"message": "Unable to update losses"});
        }
    }
}

const addUserGame = async (req, res) => {
    if (req.body.username) {
        try {
            const activeUser = await Users.findOne({username: req.body.username});
            if (activeUser) {
                activeUser.addGame();
                return res.status(200).json({"message": "Game added"});
            } else {
                return res.status(401).json({"message": "Unable to establish user"});
            }
        } catch (err) {
            return res.status(401).json({"message": "Unable to update games"});
        }
    }
}



module.exports = {
    getCurrentUser,
    addUserWin,
    addUserLoss,
    addUserGame,
}