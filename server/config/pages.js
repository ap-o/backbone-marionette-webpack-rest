var async = require('async');
var authController = require('../controllers/auth.js');
var utils = require("../utils");

module.exports = function(app, passport) {

    app.get('/robots.txt', function(req, res){
        res.type('text/plain');

        var allow = false;

        if(allow){
            res.sendStatus("User-agent: *\nAllow: /");
        }else{
            res.sendStatus("User-agent: *\nDisallow: /");
        }
    });
      // Catch all route, show site HTML
    app.get('*', utils.reqtoLowerCase, function (req, res) {
        res.render('html.nunj');
    });

};
