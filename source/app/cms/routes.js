'use strict';

const express = require('express')
const mainController = require('./controllers/mainController');

module.exports = function(app){

    app.get('/', mainController.index)
    
}