var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var utils = require("../utils");

var SALT_WORK_FACTOR = 10;


var schema = new Schema({

    avatar: {type: String, index:true},

    firstname: {type: String, index:true},
    lastname: {type: String, index:true},

    email: { type: String, required: true, index: true, unique: true },

    password: { type: String, select: false },

    facebook: {
        id: {type: String, sparse: true, unique: true},
        token: String
    },

    google: {
        id: {type: String, sparse: true, unique: true},
        token: String
    },

    twitter: {
        id: {type: String, sparse: true, unique: true},
        token: String
    },

    lastVisit: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },

});



schema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

schema.statics.getOrCreateUser = function(req, accessToken, refreshToken, profile, callback) {
    var self = this;

    var isNew = false;

    var newUser;

    utils.breakWaterfall([

        // Try to find an account with the social login id
        function(done){
            var q = {};
            q[profile.provider+'.id'] = profile.id;

            self.findOne(q, function(err, user) {
                if(err) return done(err);

                if(user){
                    done('break', user);
                }else{
                    done();
                }
            });
        },

        // Find user with same email?
        function(done){
            if(!profile.emails){
                return done('no email available');
            }

            self.findOne({email:profile.emails[0].value}, function(err, user){
                if(err) return done(err);
                if(user){
                    if(user.reservation){
                        done(null, user);
                    }else{
                        done('break', false);
                    }
                }else{
                    done(null, null);
                }
            });
        },

        // We are creating... populate basic new user details
        function(user, done){
            if(!user) isNew = true;


            newUser = user || new self();
            newUser.email = profile.emails[0].value;
            newUser.firstname = profile.name.givenName;
            newUser.lastname = profile.name.familyName;

            done();
        },

        // Try to create user
        function(done){

            newUser[profile.provider] = {
                id: profile.id,
                token: accessToken
            };

            // Save the user
            newUser.save(function(err){
                if(err){
                    console.log(err);
                    return done(err);
                }
                done(null, newUser);
            });
        }

    ], function(err, user){
        callback(err, user);
    });


};

schema.statics.linkToPassportProfile = function(req, accessToken, refreshToken, profile, callback) {
    var q = {};
    q[profile.provider+'.id'] = profile.id;

    var self = this;

    self.findOne(q, function(err, user) {
        if(err) return callback(err);

        if(user && user.id != req.user.id){
            return callback(null, false, req.flash('authMessage', "The "+profile.provider+" account is already associated with another person."));
        }else{
            req.user[profile.provider] = {
                id: profile.id,
                token: accessToken
            };

            req.user.save(function(err){
                if(err) return callback(null, false, req.flash('authMessage', "Error saving."));

                callback(err, req.user, req.flash('authMessage', "Your "+profile.provider+" account has been associated with your account."));
            });
        }
    });
};

schema.statics.findByEmail= function(email, callback){
    this.findOne({email:email}).exec(function(err, user){
        if(err || !user){
            // DB Error
            callback(err);
        }else{
            callback(null, user);
        }
    });
};

var User = mongoose.model('User', schema);

module.exports = User;




