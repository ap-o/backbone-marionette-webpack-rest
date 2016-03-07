import _ from 'lodash';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';

import Link from 'behaviors/Link';
import CloseRegion from 'behaviors/CloseRegion';
import AuthBtn from 'behaviors/AuthBtn';

import css from './style.scss';
import tpl from './template.nunj';

import {
    APP_USER_CHANNEL,
    APP_USER } from 'constants';

export default Marionette.LayoutView.extend({

    template: tpl,

    tagName: 'article',

    attributes: {
        'data-view': 'profile-view'
    },

    className: "close-region",

    behaviors: {
        auth: {
            behaviorClass: AuthBtn
        },
        close: {
            behaviorClass: CloseRegion
        },
        link: {
            behaviorClass: Link
        },
    },

    serializeData () {
        let appuser = radio.request(APP_USER_CHANNEL, APP_USER);

        return {
            appuser : appuser.toJSON()
        };
    }

});
