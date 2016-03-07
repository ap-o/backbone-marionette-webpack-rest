var _ = require('underscore');
var async = require('async');
var passport = require('passport');

exports.checkForUser = function (req, res) {
    if(req.user){
        res.json(req.user);
    }else{
        res.sendStatus(401);
    }
};


exports.ensureAuthenticated = function(req, res, next) {
    if(!req.isAuthenticated || !req.isAuthenticated()){

        passport.authenticate('bearer', { session: false }, function(err, user, info) {
            if (err) { return next(err); }

            if (!user) {
                return  res.status(401).end();
            }

            req.logIn(user, { session: false }, function(err) {
                if (err) { return next(err); }
                next();
            });
        })(req, res, next);

    }else{
        next();
    }
};

// exports.ensureAuthenticatedAndRedirect = function(req, res, next) {
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect('/login?client_id='+req.query.client_id+'&response_type='+req.query.response_type);
//     }
// };



exports.facebook = passport.authenticate('facebook');

exports.facebookCallback = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
});


exports.google = passport.authenticate('google');

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
});




exports.twitter = passport.authenticate('twitter');

exports.twitterCallback = passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/'
});




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

}
