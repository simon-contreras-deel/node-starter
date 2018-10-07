'use strict'

module.exports = {

    async getProfile (user) {
        return user.getPublicInfo()
    },

    async setProfile (user, data) {
        const name = data.name
        const lastname = data.lastname
        const image = data.image

        let profile = user.profile || {}

        if (name) { profile.name = name }
        if (lastname) { profile.lastname = lastname }
        if (image) { profile.image = image }

        await user.update({ profile })
        return user.getPublicInfo()
    }
}
