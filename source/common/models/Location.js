const mongoose = require('mongoose')
const debug = require('debug')('app:User')

const pointSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    order: {
        type: Number
    },
}, { _id : false })

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'point', 
            'originAndDestination'
        ],
        required: true
    },
    points: {
        type: [pointSchema]
    },
}, { _id : false })

modules.export = locationSchema