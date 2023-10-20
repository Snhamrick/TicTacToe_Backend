const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require ('express-jwt');

const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const authToken = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256']
});

router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/user')
    .get(authToken, userController.getCurrentUser);

router
    .route('/win')
    .put(authToken, userController.addUserWin);

router
    .route('/loss')
    .put(authToken, userController.addUserLoss);

router
    .route('/games')
    .put(authToken, userController.addUserGame);

module.exports = router;