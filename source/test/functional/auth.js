'use strict';

const expect = require('chai').expect
const app = require('../../index').api
const request = require('supertest').agent(app)
const faker = require('faker')
const exception = requireRoot('common/services/customExceptions')
const debug = require('debug')('app:test:functional:auth')

let validUser
let validToken

describe('FUNCTIONAL API - AUTH', function(){
    it('should response ok (register)',function(done){
        let data = validUser = {
            "email": faker.internet.email().toLowerCase(),
            "password": faker.internet.password(),
            "username": faker.internet.userName().toLowerCase()
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('token')
                expect(res.body.data).to.have.property('user')
                expect(res.body.data.user.email).to.be.equal(data.email)
                expect(res.body.data.user.username).to.be.equal(data.username)
                done()
            })
    })

    it('should response ko (register email already exist)',function(done){
        let error = new exception.RegistrationError()

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(validUser)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "That email address is already in use."
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (register username already exist)',function(done){
        let error = new exception.RegistrationError()
        let data = {
            "email": faker.internet.email().toLowerCase(),
            "password": validUser.password,
            "username": validUser.username
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "That username is already in use."
                        }
                    }
                })
                done()
            })
    })

    it('should response ok (login with email)',function(done){
        let data = {
            "email": validUser.email,
            "password": validUser.password,
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                expect(res.body.data.token).to.be.an('string')
                validToken = res.body.data.token
                done()
            })
    })

    it('should response ok (login with username)',function(done){
        let data = {
            "username": validUser.username,
            "password": validUser.password,
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                expect(res.body.data.token).to.be.an('string')
                validToken = res.body.data.token
                done()
            })
    })

    it('should response ko (login invalid password)',function(done){
        let error = new exception.LoginError()
        let data = {
            "email": validUser.email,
            "password": faker.internet.password(),
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "Your login details could not be verified. Please try again."
                        }
                    }
                })
                done()
            })
    })

    it('should response ok (logged)',function(done){
        request
            .get('/logged')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                done()
            })
    })

    it('should response ko (logged with invalid token)',function(done){
        let error = new exception.ValidationPublicKeyFailed()

        request
            .get('/logged')
            .set('X-device', 'aaa')
            .set('Authorization', validToken + 'aaa')
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message
                    }
                })
                done()
            })
    })

    it('should response ko (logged with invalid device)',function(done){
        let error = new exception.ValidationPublicKeyFailed()

        request
            .get('/logged')
            .set('X-device', 'bbb')
            .set('Authorization', validToken)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message
                    }
                })
                
                done()
            })
    })
})