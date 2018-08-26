'use strict';

const debug = require('debug')('app:controller:user')
const userManager = requireRoot('managers/userManager')

module.exports = {

    async getProfile(req, res) {
        return userManager.getProfile(req.user)
    },

    async setProfile(req, res) {
        return userManager.setProfile(req.user, req.body)
    },

    async getPayments(req, res) {
        return userManager.getPayments(req.user)
    },

    async setPayments(req, res) {
        return userManager.setPayments(req.user, req.body)
    },

    async deletePayment(req, res) {
        return userManager.deletePayment(req.user, req.params.id)
    }

}
