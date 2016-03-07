import _ from 'lodash';
import css from './style.scss';

import Backbone from 'backbone';
import Marionette from 'marionette';

export default Marionette.Behavior.extend({

    fetchXhr : null,

    timer : null,

    retryDelay : 1000,

    onShow () {
        if(this.view.options.preload && (this.view.collection || this.view.model)){
            this.preload();
        }
    },

    preload () {
        let options = {};
        options.success = _.bind(this.onFetchComplete, this);
        options.error = _.bind(this.onFetchError, this);

        let datasource = this.view.collection || this.view.model;
        Marionette.triggerMethodOn(this.view, 'preload:start', this.view, this);
        this.fetchxhr = datasource.fetch(options);
    },

    onFetchComplete () {
        Marionette.triggerMethodOn(this.view, 'preload:complete', this.view, this);
        delete this.options.preload;
    },

    onFetchError () {
        Marionette.triggerMethodOn(this.view, 'preload:error', this.view, this);
        this.timer = setTimeout(() => {
            this.preload();
        }, this.retryDelay);
    },

    onDestroy () {
        clearTimeout(this.timer);
        if(this.fetchXhr && this.fetchXhr.readyState!==4)
            this.fetchXhr.abort();
    }


});
