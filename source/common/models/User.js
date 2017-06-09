'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const slugify = requireRoot('common/services/slugify')
const debug = require('debug')('app:User')

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    }
}, { _id : false });

const profileSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    image: String
}, { _id : false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'Client',
            'SuperAdmin'
        ],
        default: 'Client',
        required: true
    },
    tokens: {
        type: [tokenSchema]
    },
    profile: {
        type: profileSchema
    }
},
{
    timestamps: true,
    versionKey: false
});


userSchema.pre('save', function(next) {
    const user = this;
/*
    if (user.isModified('username')) {
        user.username = slugify(user.username);
    }
*/
    const SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    comparePassword: function(candidatePassword) {
        // wrap callback
        return new Promise( (resolve, reject) => {
            bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
                if (err || !isMatch) {
                    debug('Password not valid')
                    resolve(false);
                }

                resolve(true);
            });
        })
    },

    getPublicInfo: function() {
        return {
            email: this.email,
            username: this.username,
            role: this.role,
            profile: this.profile
        }
    },
    getTokenByDevice: function(device) {
        for(let i = 0; i < this.tokens.length; i++) {
            if(this.tokens[i].device == device) {
                return this.tokens[i];
            }
        }

        return false;
    },
    saveToken: function(token, device) {
        let existingByDevice = false;
        for(let i = 0; i < this.tokens.length; i++) {
            if(this.tokens[i].device == device) {
                this.tokens[i].token = token;
                existingByDevice = true;
                break;
            }
        }

        if(!existingByDevice) {
            this.tokens.push({
                token: token,
                device: device
            });
        }

        this.save();
    }
};

module.exports = mongoose.model('User', userSchema, 'user');