'use strict';

const expressDeliver = require('express-deliver');
const debug = require('debug')('app:handlers')

module.exports = function(app){

    //404 and 500
    expressDeliver.errorHandler(app)

};