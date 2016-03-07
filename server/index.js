/*eslint-env node */
var mongoose = require('mongoose');
var settings = require('./config/settings');
var express = require('express');
var http = require('http');
var request = require('request');
var expressStatic = require('express-static');
var path = require('path');
var passport = require('passport');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('../webpack/webpack.config.dev.js');
var compiler = webpack(webpackConfig);
var nunjucks = require('nunjucks');
var settings = require('./config/settings');

var app = express();

nunjucks.configure(path.join(__dirname, 'templates'), { express: app });

var isDev = process.env.NODE_ENV === 'dev';

if (isDev) {
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}else{
    app.use(settings.publicPath, expressStatic(settings.outputPath) );
}

// // Connect to MongoDB
var db = mongoose.connect(settings.mongoURI, settings.mongoOptions, function(err) {
    if (err) throw err;

    console.log('Database Connected!');

    // Bootstrap passport config
    require('./config/passport')(app, passport);

    // Bootstrap application settings
    require('./config/express')(app, passport);

    // Bootstrap routes
    require('./config/routes')(app, passport);

    require('./config/pages')(app, passport);

    var server = http.createServer(app)

    server.listen(app.get('port'), function () {
        console.log('Express app running on port %s', app.get('port'));
    });

});

module.exports = app;




