'use strict'

const User = requireRoot('common/models/User')

module.exports = {
    async cleanDb(){
        return await User.remove({})
    }
}