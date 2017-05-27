'use strict';

const userManager = requireRoot('common/managers/userManager')

module.exports = {

    async login(req, res) {
        const email = req.body.email
        const password = req.body.password
        const username = req.body.username
        const device = req.device

        return userManager.login(email, username, password, device)
    },

    async register(req, res) {
        const email = req.body.email
        const password = req.body.password
        const username = req.body.username
        const device = req.device

        return userManager.register(email, password, username, device)
    },

}