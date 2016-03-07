import Backbone from 'backbone';
import Marionette from 'marionette';
import _ from 'lodash';
import radio from 'radio';
import {
    APP_USER_CHANNEL,
    APP_USER_IS_AUTHENTICATED,
    APP_USER_LOGOUT,
    APP_USER_LOGOUT_SUCCESS } from 'constants';

let userChannel = radio.channel(APP_USER_CHANNEL);




export default Marionette.AppRouter.extend({

    appRoutes : {

        // startup
        "" : {
            method:                 "home",
            region:                 "main",
            "ensureAuthenticated":  true
        },

        "_=_" : {
            method:                 "home",
            region:                 "main",
            "ensureAuthenticated":  true
        },

        "#" : {
            method:                 "home",
            region:                 "main",
            "ensureAuthenticated":  true
        },

         "login" : {
            method:                 "login",
            region:                 "main",
        },

        "home" : {
            method:                 "home",
            region:                 "main",
            "ensureAuthenticated":  true

        },

        "folder/:id" : {
            method:                 "folder",
            region:                 "main",
            "ensureAuthenticated":  true
        },

        "profile" : {
            method:                 "profile",
            region:                 "rightAside",
            "ensureAuthenticated":  true
        },

        "about" : {
            method:                 "about",
            region:                 "main",
        },

        "*path" : {
            method:                 "notFound",
            region:                 "main"
        }
    },

    initialize () {
        radio.on(APP_USER_CHANNEL, APP_USER_LOGOUT_SUCCESS, ()=> {
            window.location.href = '/';
            window.location.reload(true);
        });
    },

    route (route, options, callback) {

        if (!_.isRegExp(route)) route = this._routeToRegExp(route);

        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }

        if (!callback) callback = this[name];

        Backbone.history.route(route, (fragment)=> {
            let params = this._extractParameters(route, fragment);
            params.unshift(options.region);
            params.unshift(fragment);

            let next = ()=> {
                this.execute(callback, params);
                this.trigger.apply(this, ['route:' + name].concat(params));
                this.trigger('route', name, params);
                Backbone.history.trigger('route', this, name, params);
            };
            this.before.apply(this, [route, options, next]);

        });
        return this;
    },


    before (route, options, next){
        let requiresAuthentication = options.ensureAuthenticated === true,
            isAuthenticated = radio.request(APP_USER_CHANNEL, APP_USER_IS_AUTHENTICATED);

        if(!requiresAuthentication || isAuthenticated){
            return next();
        }else{
            Backbone.history.navigate('/login', { trigger : true });
            return this;
        }
    },

    _addAppRoute (controller, route, routeConfig) {
        let method = controller[routeConfig.method];
        if (!method) {
            throw new Marionette.Error('Method "' + method + '" was not found on the controller');
        }
        this.route(route, routeConfig, _.bind(method, controller));
    }


});
