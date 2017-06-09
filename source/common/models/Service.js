const mongoose = require('mongoose')
const debug = require('debug')('app:Service')
const scheduleSchema = require('./Schedule')
const locationSchema = require('./Location')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
    },
    videos: {
        type: [String],
    },
    schedule: {
        type: [scheduleSchema],
        required: true
    },
    location: {
        type: [locationSchema],
        required: true
    }, 
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
})
