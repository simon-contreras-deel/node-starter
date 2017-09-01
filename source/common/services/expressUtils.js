'use strict'; 

const express = require('express');
const debug   = require('debug')('app:expressUtils');

const parameters = requireRoot('../parameters');

const testMode = process.env.TEST_MODE == 1;

exports.bootstrap = function (module) {

    const app = express();

    requireRoot('app/'+ module +'/middlewares')(app);
    requireRoot('app/'+ module +'/routes')(app);
    requireRoot('app/'+ module +'/handlers')(app);

    var port = testMode ? parameters.test.apps[module].listenPort : parameters.apps[module].listenPort;

    // If run in mocha disabled the listen
    if (typeof describe == 'undefined') {
        app.listen(port,function(){
            debug(module + ' http listening ', port);
        });
    }

    return app;
}