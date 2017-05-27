'use strict'

const mongoose = require('mongoose')
const debug      = require('debug')('app: mongoose')
const parameters = requireRoot('parameters');


let client;

const testMode = process.env.TEST_MODE == 1;
const mockMode = process.env.MOCK_MODE == 1;

/**
 * Used to track mongoose connection status
 * @type {Boolean}
 */
exports.connected = false;

/**
 * Get mongoose client
 * @return {MongoClient}
 */
exports.getClient = function(){
    return client
}

exports.startClient = function(){

    var eventNames = ['connecting', 'connected', 'open', 'disconnecting', 'disconnected', 'close', 'reconnected', 'error', 'fullsetup', 'all']
    mongoose.connection
        .on('open',()=>{
            this.connected = true
        })
        .on('disconnected',()=>{
            this.connected = false
            setTimeout(connect,4000)
        })

    eventNames.forEach(function(eventName){
        mongoose.connection.on(eventName,function(e){
            if (e)
                debug(eventName,e,mongoose.connection.readyState)
            else
                debug(eventName,mongoose.connection.readyState)
        })
    })
    
    connect()
};

function connect(){
    var paramsMongodbConnectionUri = parameters.mongodbConnectionUri;
    if (testMode)
        paramsMongodbConnectionUri = parameters.test.mongodbConnectionUri
    else if (mockMode)
        paramsMongodbConnectionUri = parameters.mock.mongodbConnectionUri

    mongoose.connect(paramsMongodbConnectionUri,{
        server:{
            auto_reconnect: true,
            socketOptions: { keepAlive: 1 },
            reconnectTries: Number.MAX_SAFE_INTEGER
        }
    });
}