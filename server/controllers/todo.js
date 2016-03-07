var mongoose = require('mongoose');
var passport = require('passport');
var async = require('async');
var _ = require('lodash');

var auth = require('./auth');

var Todo = require('../models/todo');

exports.create = function(req, res){

    async.waterfall([
        function(done){
            var folderId = _.isString(req.body.folder) ? req.body.folder : req.body.folder._id;

            var doc = new Todo({
                title: req.body.title,
                folder: folderId,
                completed: false
            });
            done(null, doc);
        },
        // set owner
        function(doc, done){
            doc.owner = req.user._id;
            done(null, doc);
        },
        // save
        function(doc, done){
            doc.save(function(err, doc){
                if(err){
                    res.status(404);
                    return done(err);
                }
                done(null, doc);
            });
        },

    ], function(err, doc){
        if(err){
            return res.send(err);
        }
        res.json(doc);
    });
};


exports.update = function(req, res){
    async.waterfall([

        function(done){
            var query = {
                owner: req.user._id,
                _id: req.params.id
            };
            done(null, query);
        },

        function(query, done){
            Todo.findOne(query, function(err, doc){
                if(err){
                    res.status(404);
                    return done('Todo not found');
                }
                done(null, doc);
            });
        },

        function(doc, done){
            if(!_.isUndefined(req.body.title))
                doc.title = req.body.title;

            if(!_.isUndefined(req.body.archived))
                doc.archived = req.body.archived;

            if(!_.isUndefined(req.body.completed))
                doc.completed = req.body.completed;

            done(null, doc);
        },

        function(doc, done){
            doc.save(function(err, doc){
                if(err){
                    res.status(400);
                    return done(err);
                }
                done(null, doc);
            });
        }

    ], function(err, doc){
        if(err){
            return res.send(err);
        }
        res.json(doc);
    });
};

/*
 * LIST PUT/POST
 */
exports.list = function(req, res){
    async.waterfall([

        function(done){
            var query = {
                owner: req.user._id,
                archived: false,
                deleted: false
            };

            if(!_.isUndefined(req.body.folder))
                query.folder = req.body.folder;

            done(null, query);
        },

        function(query, done){
            Todo.find(query, {title:1, completed:1}).sort({created:-1}).exec(done);
        }

    ], function(err, results){
        if(err){
            return res.sendStatus(400);
        }
        res.json(results);
    });
};

/*
 * DELETE
 */
exports.delete = function(req, res){
    async.waterfall([

        function(done){
            var query = {
                owner: req.user._id,
                _id: req.params.id
            };
            done(null, query);
        },

        function(query, done){
            Todo.findOne(query, function(err, doc){
                if(err){
                    res.status(404);
                    return done('Todo not found');
                }
                done(null, doc);
            });
        },

        function(doc, done){
            doc.remove(function(err, doc){
                if(err){
                    res.status(400);
                    return done(err);
                }
                done(null, doc);
            });
        }

    ], function(err, doc){
        if(err){
            return res.send(err);
        }
        res.json(doc);
    });
};


/*
 * GET
 */
exports.get = function(req, res){
    async.waterfall([

        function(done){
            var query = {
                owner: req.user._id,
                _id: req.params.id
            };
            done(null, query);
        },

        function(query, done){
            Todo.findOne(query, function(err, doc){
                if(err){
                    res.status(404);
                    return done('Todo not found');
                }
                done(null, doc);
            });
        }

    ], function(err, doc){
        if(err){
            return res.send(err);
        }
        res.json(doc);
    });
};

