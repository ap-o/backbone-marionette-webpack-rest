var _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');
var passport = require('passport');
var crypto = require('crypto');
var https = require('https');
var url = require('url');
var Hashids = require("hashids");

var utils = require("../utils");

var User = require('../models/user');

var hashids = new Hashids("tokenegneratorsalt", 4, "1234567890abcdefghijklmnopqrstuvwxyz");


exports.logout = function (req, res, next) {
    req.logout();
    req.session.destroy(function (err) {
        if (err) { return next(err); }
        return res.status(401).send("logged out");
    });
};

exports.removeFacebook = function(req, res){
    removeProvider(req, res, 'facebook');
};

exports.removeTwitter = function(req, res){
    removeProvider(req, res, 'twitter');
};

exports.removeGoogle = function(req, res){
    removeProvider(req, res, 'google');
};

var removeProvider = function(req, res, provider){

    req.user[provider] = undefined;

    req.user.save(function(err){
        if(err){
            res.status(400);
            res.end();
        }else{
            res.end();
        }
    });
};














