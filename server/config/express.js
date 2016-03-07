var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore =  require('connect-mongo')(session);
var path = require('path');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var useragent = require('express-useragent');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var settings = require('./settings');
var utils = require('../utils');
var nunjucks = require('nunjucks');


module.exports = function (app, passport) {

    app.set('port', settings.port);

    var sess = {
        resave: true,
        saveUninitialized: true,
        key: settings.sessionKey,
        secret: settings.sessionSecret,
        store: new MongoStore({
            url: settings.mongoURI, autoReconnect: true
        })
    };

    app.set('view cache', false);

    app.disable('x-powered-by');
    app.enable('trust proxy');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(flash());
    app.use(utils.reqNoSlash);
    app.use(session(sess));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(useragent.express());

};
