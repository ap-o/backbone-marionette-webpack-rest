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
    tally: {type: Number, required: true, default: 0},
    tallypending: {type: Number, required: true, default: 0},
    title: { type: String, required: true, validate: titleValidator},
    deleted: { type: Boolean, default:false }
});


schema.statics.refreshTally = function(folder, callback){


    async.waterfall([
        function(done){
            Folder.findById(folder, function(err, doc){
                done(null, doc);
            });
        },

        function(doc, done){
            Todo.count({folder:doc._id, }, function(err, count){
                doc.tally = count;
                done(null, doc)
            });
        },

        function(doc, done){
            Todo.count({folder:doc._id, completed:{$ne:true}}, function(err, count){
                doc.tallypending = count;
                done(null, doc)
            });
        },

        function(doc, done){
            doc.save(done);
        }

    ], function(err, out){
        callback();
    });

};

var Folder = mongoose.model('Folder', schema);
module.exports = Folder;

var Todo = require('../models/todo');
