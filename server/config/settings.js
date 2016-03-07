var path = require('path');

module.exports = {
    // The port to run the http server
    port: process.env.PORT || 8000,
    // The port to run the webpack-dev-server (proxied by the http server)
    webpackPort: process.env.WEBPACK_PORT || 8080,
    // compiled, the output will be placed in this directory.
    outputPath: path.resolve(process.cwd(), 'public'),
    // The public path prefix to access the outputPath via HTTP
    publicPath: '/public/',

    // Session
    sessionKey : process.env.SESSION_KEY || '4C8FB7C',
    sessionSecret: process.env.SESSION_SECRET || 'E59B2153BD18E1127FE9EBA3DBAC2BB234C25DA5F642F99DBDC2C2EE78626F4BD77C7A43C6481954CC376E9',

    // Mongo
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost/backbone-marionette-webpack-rest',
    mongoOptions: {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        },
        replset:{
            socketOptions: {
                keepAlive: 1
            }
        }
    },

    // authentication
    auth:{
        facebook: {
            clientID: process.env.FB_CLIENTID || '726254300844491',
            clientSecret: process.env.FB_SECRET || '9feeff389a86b1e1c41f13def7edbf90',
            callbackURL: process.env.FB_CALLBACK || 'http://localhost:8000/auth/facebook/callback',
            passReqToCallback: true,
            profileFields: ['id', 'emails', 'name']
        }
        // ,
        // google: {
        //     clientID: 'na',
        //     clientSecret: 'na',
        //     callbackURL: 'na',
        //     scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        //     passReqToCallback: true
        // },

        // twitter: {
        //     consumerKey: 'na',
        //     consumerSecret: 'na',
        //     callbackURL: 'na',
        //     passReqToCallback: true
        // },
    }

};
