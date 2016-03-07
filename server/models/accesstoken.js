var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var schema = new Schema({
    token: {type:String, index:true},
    client: {type:Schema.Types.ObjectId, ref:'Client', index:true},
    user: {type:Schema.Types.ObjectId, ref:'User', index:true}
});

module.exports = mongoose.model('AccessToken', schema);

var Client = require('./client');
var User = require('./user');
