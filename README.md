NodeJS bootstrap project with:
- JWT auth for multiple devices: the token depends on device (X-device header). For example, an user can have diferents tokens for Chrome (X-device: 'chrome-xxxxxx'), Firefox (X-device: 'firefox-xxxxxx'), Android (X-device: 'android-xxxxxx') and iOS (X-device: 'ios-xxxxxx') 
- ES6, async / await
- Mongodb and Redis
- Double project: api (for frontends) and cms (for admin and content creation). Can work together (npm run dev), only api (npm run dev-api) or only cms (npm run dev-cms)
- Functional tests with Mocha, Chai and supertest (npm run dev-test)
