'use strict';
const jwt = requireRoot('common/services/auth/jwt')
const User = requireRoot('common/models/User')
const debug = require('debug')('app:usermanager')

const exception = requireRoot('common/services/customExceptions')


module.exports = {

    async getProfile(user) {
        return user.getPublicInfo()
    },

    async setProfile(user, data) {
        const name = data.name
        const lastname = data.lastname
        const image = data.image

        if(!user.profile)
            user.profile = {}

        if(name) 
            user.profile.name = name
        if(lastname) 
            user.profile.lastname = lastname
        if(image) 
            user.profile.image = image

        user = await user.save()
        return user.getPublicInfo()
    }
}