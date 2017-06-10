'use strict'

var argv = require('yargs')
    .alias('h', 'help')
    .help('h')
    .alias('c', 'cms')
    .describe('c', 'Start cms app')
    .default('c', false)
    .alias('a', 'api')
    .describe('a', 'Start api app')
    .default('a', false)
    .argv;

//Globals definition
global.__basedir = __dirname;
global.requireRoot = function(name) {
    return require(__dirname + '/' + name);
};

//Basic includes
const debug = require('debug')('app:root');
const _ = require('lodash');
debug('init');
const parameters = requireRoot('parameters');

//Start redis connection
const redisConnection = requireRoot('common/services/redisConnection');
redisConnection.startClient();

//Start mongoose connection
const mongooseConnection = requireRoot('common/services/mongooseConnection');
mongooseConnection.startClient();

//Initialize web apps
const expressUtils = requireRoot('common/services/expressUtils');

var runAllapps = !argv.a && !argv.c

if (runAllapps || argv.c)
    exports.cms = expressUtils.bootstrap('cms');

if (runAllapps || argv.a)
    exports.api = expressUtils.bootstrap('api');

//Simple process log
process.on('exit', function () {
    debug('exit');
});
process.on('SIGINT', function () {
    debug('sigint');
    process.exit(1);
});
