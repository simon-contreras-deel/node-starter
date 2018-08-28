'use strict';

const debug = require('debug')('app:controller:user')
const userManager = requireRoot('managers/userManager')

module.exports = {

    async getProfile(req, res) {
        return userManager.getProfile(req.user)
    },

    async setProfile(req, res) {
        return userManager.setProfile(req.user, req.body)
    }

}
