import _ from 'lodash';
import async from 'async';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';
import Rooter from 'routes/root';
import RootLayout from 'containers/Root';
import appUser from 'models/AppUser';
import ViewController from 'controllers/ViewController';

import {
    APP_CHANNEL,
    APP_LOADING_START,
    APP_LOADING_END,
    APP_USER_CHANNEL,
    APP_USER_FETCH,
    APP_USER_FETCH_SUCCESS,
    APP_USER_READY } from 'constants';

let userChannel = radio.channel(APP_USER_CHANNEL);

export default Marionette.Application.extend({

    initialize () {
        this.root = new RootLayout().render();
        this.viewController = new ViewController({rootView:this.root});
        this.router = new Rooter({
            controller: this.viewController
        });
    },

    onStart () {

        async.waterfall([
            (done) =>{
                radio.trigger(APP_CHANNEL, APP_LOADING_START);
                done(null);
            },
            (done) => {
                userChannel.on(APP_USER_FETCH_SUCCESS, function(user){
                    done(null);
                });
                userChannel.request(APP_USER_FETCH);
            }

        ], (err) => {
            radio.trigger(APP_CHANNEL, APP_LOADING_END)
            this.startRouting();
        });

    },


    startRouting () {
        this.ajaxSetup();
        Backbone.history.start({ pushState: true });
    },

    ajaxSetup () {
        $.ajaxSetup({
            cache: false,
            statusCode: {
                401: ()=> {
                    debugger;
                    window.location.href = '/';
                    window.location.reload(true);
                    // Redirec the to the login page.
                    // unauthorized
                },
                403: ()=> {
                    // 403 -- Access denied
                },
                412: ()=> {
                    // 412 -- Precondition failed
                    // e.g. unverified user
                }
            }
        });
    }
});
