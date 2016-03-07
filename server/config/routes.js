var auth = require('../controllers/auth');
var user = require('../controllers/user');
var todo = require('../controllers/todo');
var folder = require('../controllers/folder');

// var Folder = require('../models/Folder');
// var Todo = require('../models/Todo');



module.exports = function(app, passport) {
    app.get('/api/user/logout', user.logout);
    app.get('/api/user', auth.checkForUser);

    // // Social Login Callbacks
    app.get('/auth/facebook', auth.facebook);
    app.get('/auth/facebook/callback', auth.facebookCallback);

    app.get('/api/todo/:id', auth.ensureAuthenticated, todo.get);
    app.put('/api/todo/:id', auth.ensureAuthenticated, todo.update);
    app.post('/api/todo', auth.ensureAuthenticated, todo.create);
    app.get('/api/todo/list', auth.ensureAuthenticated, todo.list);
    app.post('/api/todo/list', auth.ensureAuthenticated, todo.list);
    app.delete('/api/todo/:id', auth.ensureAuthenticated, todo.delete);

    app.get('/api/folder/:id', auth.ensureAuthenticated, folder.get);
    app.put('/api/folder/:id', auth.ensureAuthenticated, folder.update);
    app.post('/api/folder', auth.ensureAuthenticated, folder.create);
    app.get('/api/folder/list', auth.ensureAuthenticated, folder.list);
    app.post('/api/folder/list', auth.ensureAuthenticated, folder.list);
    app.delete('/api/folder/:id', auth.ensureAuthenticated, folder.delete);


}
