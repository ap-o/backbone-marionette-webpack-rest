var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var async = require('async');
var validate = require('mongoose-validator');

var titleValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 140],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];


var schema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, validate: titleValidator},
    deleted: { type: Boolean, default:false }
});

var Folder = mongoose.model('Folder', schema);
module.exports = Folder;
