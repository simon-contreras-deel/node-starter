'use strict'

const jwt = require('./jwt')
const exception = requireRoot('common/services/customExceptions')
const User = requireRoot('common/models/User')

module.exports = {

    async validate (req, res, next) {
        let token = req.get('Authorization')
        let tokenDecoded = await jwt.verify(token, req.device)
        
        let user = await User.findOne({
            _id: tokenDecoded._id,
            username: tokenDecoded.username,
            role: tokenDecoded.role,
            "tokens.token": token,
            "tokens.device": req.device
        })
        
        if(!user) {
            throw new exception.ValidationPublicKeyFailed()
        }

        req.user = user;

        next()
    }
}