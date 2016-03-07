import _ from 'lodash';
import css from './style.scss';

import Backbone from 'backbone';
import Marionette from 'marionette';

export default Marionette.Behavior.extend({

    fetchXhr : null,

    timer : null,

    refreshInterval : 3*1000,

    onShow () {
        if(this.view.options.autoRefresh){
            this.startRefreshInterval();
        }
    },

    startRefreshInterval () {
        if(!this.options.autoRefresh) return;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.refresh();
        }, this.refreshInterval);
    },

    refresh (callback) {
        Marionette.triggerMethodOn(this.view, 'refresh:start', this.view, this);
        this.fetchxhr = this.view.model.fetch({
            success : _.bind(this.onRefreshComplete, this),
            error : _.bind(this.onRefreshError, this)
        });
    },

    onRefreshComplete () {
        Marionette.triggerMethodOn(this.view, 'refresh:complete', this.view, this);
        this.startRefreshInterval();
    },

    onRefreshError () {
        Marionette.triggerMethodOn(this.view, 'refresh:error', this.view, this);
        this.startRefreshInterval();
    },

    onDestroy () {
        clearTimeout(this.timer);
        if(this.fetchXhr && this.fetchXhr.readyState!==4)
            this.fetchXhr.abort();
    }


});
