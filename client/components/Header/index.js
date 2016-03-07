import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import radio from 'radio';

import Link from 'behaviors/Link';

import css from './style.scss';
import tpl from './template.nunj';

import {
    APP_USER_CHANNEL,
    APP_USER,
    APP_USER_LOGIN_SUCCESS } from 'constants';

export default Marionette.LayoutView.extend({

    template: tpl,

    attributes: {
        'data-view': 'app-header-view'
    },

    behaviors: {
        link: {
            behaviorClass: Link
        }
    },

    initialize () {
        this.onLoginSuccess = _.bind(this.render, this);
        radio.on(APP_USER_CHANNEL, APP_USER_LOGIN_SUCCESS, this.onLoginSuccess);
    },

    serializeData () {
        let appuser = radio.request(APP_USER_CHANNEL, APP_USER);

        return {
            appuser : appuser.toJSON()
        };
    }


});
