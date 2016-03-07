import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import radio from 'radio';

import css from './style.scss';
import tpl from './template.nunj';

export default Marionette.LayoutView.extend({

    template : tpl,

    attributes : {
        'data-view': 'create-view'
    },

    ui: {
        'form': 'form',
        'titleinput': 'input[type=text]',
    },

    events: {
        'submit form': 'onSubmit'
    },

    onSubmit (e){
        let title = this.ui.titleinput.val();
        this.trigger('create', title);

        this.ui.titleinput.val('');

        e.preventDefault();
        return false;
    },

    serializeData () {
        return {
            placeholder: this.options.placeholder
        };
    }


});
