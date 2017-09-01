'use strict'

const jwt = require('jsonwebtoken')
const moment = require('moment')
const debug = require('debug')('app:jwt')
const parameters = requireRoot('../parameters');
const exception = requireRoot('common/services/customExceptions')
const User = requireRoot('common/models/User')

module.exports = {
    generateAccessToken: (user, device) => {
        return 'JWT ' + jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role,
                device: device
            },
            parameters.secret,
            {
                expiresIn: 24*60*60
            }
        );
    },

    async verify(token, device) {
        try {
            var decoded = jwt.verify(token.substring(4), parameters.secret);
  
            // expiration
            if(moment().valueOf() > decoded.exp * 1000) {
                debug('Token expired')
                throw new exception.ValidationTokenExpired()
            }

            let user = await User.findOne({
                _id: decoded._id,
                username: decoded.username,
                role: decoded.role,
                "tokens.token": token,
                "tokens.device": device
            })

            if(!user) {
                debug('Not user found')
                throw new exception.ValidationPublicKeyFailed()
            }

            return user;
            
        } catch (err) {
            debug(err)
            throw new exception.ValidationPublicKeyFailed()
        }
    }
}