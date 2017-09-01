'use strict'

const redis = require('redis')
const q = require('q')
const _ = require('lodash')
const parameters = requireRoot('../parameters')
const debug = require('debug')('app:redis')
const Promise = require('bluebird')

// Promisify redis
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

let testMode = process.env.TEST_MODE == 1

let client

/**
 * Used to track redis connection status
 * @type {Boolean}
 */
exports.connected = false

/**
 * Get redis client
 * @return {RedisClient}
 */
exports.getClient = function(){
    return client
}

/**
 * Starts the connection with Redis
 */
exports.startClient = function(){

    const eventNames = ['ready','connect','reconnecting','error','end','warning']
    let firstReady = false

    //Connection uri
    const redisUrl = (!testMode) ? parameters.redisConnectionUri : parameters.test.redisConnectionUri

    //Client initialization
    client = redis.createClient({
        url : redisUrl,
        retry_strategy: function (options) {
            debug('Redis Reconnecting attempt '+options.attempt)
            return Math.min(options.attempt*50,5000)
        }
    })

    //Client event listening for changes in connection
    client.on('ready',function(){
        if (!firstReady)
            firstReady = true
        debug('Redis Connected')
        exports.connected = true
    })

    client.on('end',function(){
        debug('Redis Disconnected')
        exports.connected = false
    })
    client.on('error',function(){
        debug('Redis Error connecting')
        exports.connected = false
    })

    //Clients event debug 
    if (debug.enabled){
        eventNames.forEach(function(eventName){
            client.on(eventName,function(e){
                if (e)
                    debug(eventName,e)
                else
                    debug(eventName)
            })
        })
    }


    //Promisify redis commands
    for(let method in client){
        if (/^[A-Z]+$/.test(method)){
            client[method.toLowerCase()+'Q'] = q.nbind(client[method],client)
        }
    }
}