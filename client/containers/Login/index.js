import _ from 'lodash';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';

import AuthBtn from 'behaviors/AuthBtn';

import css from './style.scss';
import tpl from './template.nunj';

import {
    APP_CHANNEL,
    APP_NOTIFICATION } from 'constants';

export default Marionette.LayoutView.extend({

    template: tpl,

    attributes: {
        'data-view': 'login-view'
    },

    behaviors: {
        auth: {
            behaviorClass: AuthBtn
        }
    }

});
