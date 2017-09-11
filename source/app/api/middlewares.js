'use strict'

const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const expressDeliver = require('express-deliver')
const customExceptions = requireRoot('common/services/customExceptions')
const mongooseConnection = requireRoot('common/services/mongooseConnection');
const redisConnection = requireRoot('common/services/redisConnection');

const parameters = requireRoot('../parameters');

var debug = require('debug')('app:api')

module.exports = function(app){

    expressDeliver(app, {
        exceptionPool: customExceptions,
        printErrorStack: parameters.expressDeliver.printErrorStack,
        printInternalErrorData: parameters.expressDeliver.printInternalErrorData
    })
    
    // Disable express header
    app.set('x-powered-by',false)
    app.set('etag', false)

    // cors
    app.use(cors())

    // Helmet security enabled
    app.use(helmet())

    // Simple request logger
    if (debug.enabled)
        app.use(morgan('dev'))

    // Throw error if no db connection
    app.use(function(req,res,next){
        if (!redisConnection.connected)
            throw new customExceptions.DatabaseError();
        if (!mongooseConnection.connected)
            throw new customExceptions.DatabaseError();
        next();
    });
    
    // Parses http body
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    // Check device
    app.use(function(req,res,next){
        let device = req.get('X-device')
        debug('device', device)

        if (!device)
            throw new customExceptions.ValidationDeviceFailed();
        
        req.device = device
        next();
    });

}