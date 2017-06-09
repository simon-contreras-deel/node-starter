const mongoose = require('mongoose')
const debug = require('debug')('app:User')

const timetableSchema = new mongoose.Schema({
    startHour: {
        type: Number,
        required: true
    },
    startMinute: {
        type: Number,
        required: true
    },
    endHour: {
        type: Number,
    },
    endMinute: {
        type: Number,
    }
}, { _id : false });

const scheduleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'WeekDays', // some week days between 2 dates
            'Period'    // all days between 2 dates
        ],
        default: 'Period',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    weekDays: {
        type: [Number],
        enum: [1, 2, 3, 4, 5, 6, 7] // isoWeekday: Monday -> 1, Sunday -> 7
    },
    timetable: [timetableSchema]
}, { _id : false });

modules.export = scheduleSchema