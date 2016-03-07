var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var async = require('async');
var validate = require('mongoose-validator');



var titleValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 255],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];


var schema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    folder: { type: Schema.Types.ObjectId, ref: 'Folder' },
    title: { type: String, required: true, validate: titleValidator},
    completed: { type: Boolean, default:false },
    archived: { type: Boolean, default:false },
    deleted: { type: Boolean, default:false }
});

schema.post('save', function(model, next) {
    Folder.refreshTally(this.folder, next);
});


var Todo = mongoose.model('Todo', schema);
module.exports = Todo;

var Folder = require('../models/folder');


