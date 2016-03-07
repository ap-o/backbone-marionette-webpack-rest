import Backbone from 'backbone';
import Marionette from 'marionette';

import {
    CLOSE_REGION } from 'constants';

export default Marionette.Behavior.extend({

    ui: {
        'close': '.btn-close-region'
    },

    events: {
        'click @ui.close': 'onClose'
    },

    onClose (evt) {
        this.view.trigger(CLOSE_REGION);
    }

});
