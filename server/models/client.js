var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var schema = new Schema({

    clientSecret: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    media: {}

});

module.exports = mongoose.model('Client', schema);