import Marionette from 'marionette';
import radio from 'radio';

import Link from 'behaviors/Link';

import css from './style.scss';
import tpl from './template.nunj';

export default Marionette.ItemView.extend({

    template: tpl,
    tagName: 'div',

    attributes: {
        'data-view': 'empty-view'
    },

    serializeData () {
        return this.options;
    }




});
