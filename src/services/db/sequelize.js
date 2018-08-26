const Sequelize = require('sequelize')
const { Client } = require('pg')
const debug = require('debug')('app:sequelize')
const parameters = requireRoot('../parameters')


function initConnection() {
    if(process.env.TEST_MODE) {
        parameters.postgres = parameters.test.postgres
    }

    return new Sequelize(parameters.postgres.database, parameters.postgres.username, parameters.postgres.password, {
        host: parameters.postgres.host,
        port: parameters.postgres.port,
        dialect: 'postgres',
        logging: false,

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    })
}

function initModels(sequelize) {
    const modelNames = [
        'User'
    ]

    const models = {}
    modelNames.forEach(function (modelName) {
        const model = sequelize.import(__dirname + '/../../models/' + modelName)
        models[modelName] = model
    })

    for(let modelName in models) {
        const model = models[modelName]
        if ('associate' in model)
            model.associate(models)
    }

    return models
}

function createDb() {
    debug('Creating database "' + parameters.postgres.database + '"')

    var client = new Client({
        user: parameters.postgres.username,
        host: parameters.postgres.host,
        database: 'postgres',
        password: parameters.postgres.password,
        port: parameters.postgres.port,
    })

    return new Promise((resolve, reject) => {
        client.connect()

        const query = 'CREATE DATABASE ' + parameters.postgres.database + ' WITH ENCODING=\'UTF8\' OWNER =  postgres '
        client.query(query, err => {
            if (err) {
                reject('Error creating database: ' + err.message)
            }

            client.end()
            resolve()
        })
    })
}

function isConnected(sequelize) {
    return sequelize.authenticate()
        .then(() => true)
        .catch(err => {
            if (err.name == 'SequelizeConnectionError' && err.message == 'database "' + parameters.postgres.database + '" does not exist') {
                return createDb()
                    .then(() => startClient())
                    .catch(err => { throw err })
            } else {
                throw err
            }
        })
}

function startClient() {
    const sequelize = initConnection()
    const models = initModels(sequelize)

    return isConnected(sequelize)
    .then(status => {
        debug('connected')

        return sequelize.sync()
            .then(data => {
                debug('sync')
                return models
            })
            .catch(err => {
                debug('error')
            })
    })
    .catch(err => {
        debug('error', err)
    })
}

module.exports = {
    startClient
}
