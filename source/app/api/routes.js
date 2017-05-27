'use strict';

const express = require('express')
const expressDeliver = require('express-deliver')
const exception = requireRoot('common/services/customExceptions')
const auth = requireRoot('common/services/auth/auth')

const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController');


module.exports = function(app){

    // Main routes
    app.get('/', mainController.index);
    app.get('/logged', auth.validate, mainController.logged);
    

    // Auth routes
    let authRouter = express.Router({mergeParams:true})
    expressDeliver(authRouter)
    app.use('/auth', authRouter)

    authRouter.post('/register', authController.register)
    authRouter.post('/login', authController.login);
    
}