'use strict';

const expressDeliver = require('express-deliver');
const debug = require('debug')('app:handlers')

module.exports = function(app){

    app.use(function(err, req, res, next) {
        console.error(err);
        res.status(500).send('Something broke!');
    });

    //404 and 500
    expressDeliver.errorHandler(app)

};