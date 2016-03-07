import Backbone from 'backbone';
import radio from 'radio';
import Marionette from 'marionette';

import {
    APP_USER_CHANNEL,
    APP_USER_LOGOUT } from 'constants';

let userChannel = radio.channel(APP_USER_CHANNEL);

export default Marionette.Behavior.extend({

    ui: {
        'loginlink': '.btn-login',
        'logoutlink': '.btn-logout'
    },

    events: {
        'click @ui.logoutlink': 'onLogout',
        'click @ui.loginlink': 'onLoginLinkClick'
    },

    onLoginLinkClick (evt) {
        evt.preventDefault();
        var strategy = evt.target.dataset['login'];
        window.location.href = '/auth/'+strategy;
    },

     onLogout (evt) {
        evt.preventDefault();
        userChannel.request(APP_USER_LOGOUT, this);
    }


});
