'use strict'

const jwt = require('./jwt')
const debug = require('debug')('app:auth')
const exception = requireRoot('common/services/customExceptions')

module.exports = {

    async validate (req, res, next) {
        let token = req.get('Authorization')
        debug(token)

        if(!token || token.indexOf('JWT ') !== 0) {
            throw new exception.ValidationPublicKeyFailed()
        }

        let user = await jwt.verify(token, req.device);
        if(!user) {
            throw new exception.ValidationPublicKeyFailed()
        }

        req.user = user;

        return true;
    }
}