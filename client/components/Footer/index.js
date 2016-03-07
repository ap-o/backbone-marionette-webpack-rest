import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import radio from 'radio';

import Link from 'behaviors/Link';

import css from './style.scss';
import tpl from './template.nunj';

export default Marionette.LayoutView.extend({

    template: tpl,

    attributes: {
        'data-view': 'app-footer-view'
    },

    behaviors: {
        link: {
            behaviorClass: Link
        },
    }


});
