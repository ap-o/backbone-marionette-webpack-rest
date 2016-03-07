var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var mongoose = require('mongoose');

var User = require('../models/user');
var AccessToken = require('../models/accesstoken');

var settings =  require('./settings');

/*
 * Expose
 */
module.exports = function(app, passport) {

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });


    var cb = function(req, accessToken, refreshToken, profile, done){
        if( !req.user ){
           /* Check if user exists - if not, creates a new account in DB. Return user account to the callback */
           User.getOrCreateUser(req, accessToken, refreshToken, profile, done);
        }else if(!req.user.verified){
            done(true);
        }else{
           /* Link the login to the existing account in the DB, return full, updated user account to the callback */
           User.linkToPassportProfile(req, accessToken, refreshToken, profile, done)
        }
    };

    /**
     * Local Strategy
     *
     * This strategy is used to authenticate users based on an username & password.
     *
     */
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'},
        function(email, password, done){
            User.findOne({email: email.toLowerCase(), reservation:{$ne:true}}, function(error, user){
                if(error) {
                    console.log('Error occured:'+error);
                    return done(error);
                }
                if(!user){
                    // console.log('User not found');
                    return done(null, false, {message:'User not found'});
                }

                user.comparePassword(password, function(err, isMatch){
                    if(!err && isMatch){
                        // console.log('Correct Password');
                        return done(null, user);
                    }else{
                        // console.log('Incorrect password');
                        return done(null, false, {message:'Incorrect Password'});
                    }
                });
            });
        }
    ));


    passport.use(new FacebookStrategy(settings.auth.facebook, cb));
    // passport.use(new GoogleStrategy(config.auth.providers.google, cb));
    // passport.use(new TwitterStrategy(config.auth.providers.twitter, cb));


    /**
     * BearerStrategy
     *
     * This strategy is used to authenticate users based on an access token (aka a
     * bearer token).  The user must have previously authorized a client
     * application, which is issued an access token to make requests on behalf of
     * the authorizing user.
     */
    passport.use(new BearerStrategy(
        function(accessToken, done) {
            // console.log("BearerStrategy", accessToken);
            AccessToken.findOne({token:accessToken}, function(err, token) {
                // console.log("AccessToken.findOne", token, err);
                if (err) { return done(err); }
                if (!token) { return done(null, false); }

                User.findById(token.user, function(err, user) {
                // User.findById(token.user, function(err, user) {
                    // console.log("User.findById", user, err);
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    // to keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes
                    var info = { scope: '*' }
                    done(null, user, info);
                });
            });
        }
    ));

};

