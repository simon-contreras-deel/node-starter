'use strict'

const redis = requireRoot('services/db/redis')

module.exports = {
    async cleanDb(){
        const redisClient = redis.getClient()
        await redisClient.flushdbAsync()

        const models = requireRoot('../appManager').models
        for(let modelName in models) {
            // await models[modelName].destroy({ where: {}})
        }

        return
    }
}
