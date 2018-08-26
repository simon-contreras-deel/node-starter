# NodeJS bootstrap project
[![Build Status](http://api.travis-ci.org/oleurud/node-starter.svg?branch=master)](http://travis-ci.org/oleurud/node-starter)

## Features:
- JWT auth for multiple devices: the token depends on device (X-device header). For example, an user can have diferents tokens for Chrome (X-device: 'chrome-xxxxxx'), Firefox (X-device: 'firefox-xxxxxx'), Android (X-device: 'android-xxxxxx') and iOS (X-device: 'ios-xxxxxx')
- ES6, async / await
- Postgres and Redis
- Functional tests with Mocha, Chai and supertest (npm run dev-test)
- Basic user profile
- Also, there is a version with [MongoDB, Redis and 2 express apps](https://github.com/oleurud/node-starter/tree/mongo-redis)

## Frontend
Starter frontend in Vue [node-starter-frontend](https://github.com/oleurud/node-starter-frontend)

## Initial configuration
npm run init
