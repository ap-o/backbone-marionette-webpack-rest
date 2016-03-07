// Require NPM Modules
var fs = require("fs");
var mongoose = require("mongoose");
var path = require("path");
var async = require('async');
var _ = require('lodash');
var crypto = require('crypto');



exports.reqNoSlash = function(req, res, next) {
    if(req.url.substr(-1) == '/' && req.url.length > 1){
        res.redirect(301, req.url.slice(0, -1));
    }else{
        next();
    }
};

exports.reqtoLowerCase = function(req, res, next) {
    if(/[A-Z]/.test(req.url)){
        res.redirect(301, req.url.toLowerCase());
    }else{
        next();
    }
};

exports.capitalizeFirstLetter = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.breakWaterfall = function(tasks, callback){
    async.waterfall(tasks, function(){
        if(arguments[0] === 'break'){
            arguments[0] = null;
        }
        callback.apply(null, arguments);
    });
}

exports.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.pluckProperties = function(items, props){
    return _.map(items, function(item){
        var newItem = {};
        _.each(props, function(prop){
            newItem[prop] = item[prop];
        });
        return newItem;
    });
}


exports.cleanEmailString = function(email){
    console.log('cleanEmailString', email);
    var matches = email.match(/\<(.*?)\>/);

    if(matches){
        console.log('matches');
        return matches[1];
    }else{
        console.log('nomatch');
        return email;
    }
}




/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
exports.uid = function(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

exports.generateRandomToken = function () {
  var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';

  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }

  return token;
};

exports.generateRandomHash = function(){
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

exports.numberPad = function(num, size){
    return ('000000000' + num).substr(-size);
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get(obj, path) {
    var pathParts = path.split('.');
    var current = obj;

    while(pathParts.length){
        var part = pathParts.shift();
        if(current[part] != undefined){
            current = current[part];
        }else{
            console.log('clearing as current part is: ', current[part]);
            current = undefined;
            pathParts = [];
        }
    }

    return current;
}


exports.slugify = function(text){
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/_+/g, '-')         // Replace _ with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

exports.replaceAll = function(string, find, replace){
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

exports.trim = function(text){
    return text.replace(/^\s+|\s+$/g, "");
}

exports.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

exports.toProperCase = function(string) {
  return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

exports.orId = function(ids){
    if(ids && ids.length){
        return _.map(ids, function(id){
            return {_id:id};
        });
    }else{
        return [ {_id:new mongoose.Types.ObjectId()} ];
    }
};

exports.nowTimestamp = function(){
    var now = new Date();
    return Math.round(now/1000);
};

exports.toJsonArray = function(arr){
    var out = [];
    _.each(arr, function(m,i){
        out.push( m.toJSON ? m.toJSON() : m );
    });
    return out;
};



exports.findAndPopulate = function(options, callback){

    options.model.find(options.query).select(options.select).sort(options.sort).limit(options.limit).exec(function(err, docs){
        var currentDocs = docs;

        async.eachSeries(options.populations, function(population, done){
            options.model.populate(docs, population, function(err, d){
                currentDocs = d;
                done(err);
            });
        }, function(err){
            callback(err, exports.toJsonArray(currentDocs));
        });
    });

};
