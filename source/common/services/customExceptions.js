'use strict'

const ExceptionPool = require('express-deliver').ExceptionPool

const exceptionPool = new ExceptionPool({
    ValidationFailed: {
        code:1001,
        message:'Authentication failed',
        statusCode:403
    },
    ValidationPublicKeyFailed: {
        code:1002,
        message:'Authentication failed',
        statusCode:403
    },
    ValidationDeviceFailed: {
        code:1003,
        message:'You must set a device',
        statusCode:403
    },
    ValidationTokenExpired: {
        code:1004,
        message:'Token expired',
        statusCode:403
    },
    DatabaseError: {
        code:2001,
        message:'something was wrong',
        statusCode:500
    },
    RegistrationError: {
        code:3001,
        message:'something was wrong',
        statusCode:403
    },
    LoginError: {
        code:3002,
        message:'Invalid login',
        statusCode:403
    }
})

module.exports = exceptionPool