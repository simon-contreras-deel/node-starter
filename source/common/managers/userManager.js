'use strict';
const jwt = requireRoot('common/services/auth/jwt')
const User = requireRoot('common/models/User')
const debug = require('debug')('app:usermanager')

const exception = requireRoot('common/services/customExceptions')


module.exports = {

    async login(email, username, password, device){
        if(!email && !username) {
            throw new exception.LoginError({ 
                error: "Your login details could not be verified. Please try again." 
            })
        }

        let query
        if(email)
            query = {email: email}
        else if(username)
            query = {username: username}


        let user = await User.findOne(query)
        if(!user || !await user.comparePassword(password)) {
            throw new exception.LoginError({ 
                error: "Your login details could not be verified. Please try again." 
            })            
        }

        //generate Token
        let token = jwt.generateAccessToken(user, device);
        user.saveToken(token, device);

        return {
            token: token,
            user: user.getPublicInfo()
        }
    },

    async register(email, password, username, device) {
        if (!email || !password || !username) {
            throw new exception.RegistrationError({
                email, password, username
            })
        }
        
        //check if email exists
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new exception.RegistrationError({ 
                error: 'That email address is already in use.' 
            })
        }

        //check if username exists
        existingUser = await User.findOne({ username: username })
        if (existingUser) {
            throw new exception.RegistrationError({ 
                error: 'That username is already in use.' 
            })
        }

        //valid user
        let user = new User({
            email: email,
            password: password,
            username: username
        });

        const token = jwt.generateAccessToken(user, device);
        user.tokens.push({
            token: token,
            device: device
        });

        user = await user.save()
        return {
            token: token,
            user: user.getPublicInfo()
        };
    }
}