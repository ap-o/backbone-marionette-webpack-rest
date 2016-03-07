import Marionette from 'marionette';

import {
    CLOSE_REGION } from 'constants';

export default Marionette.Region.extend({


    onEmpty : function(){
        this.$el.addClass('hide');
    },

    onShow : function(){
        this.$el.removeClass('hide');
    },

    show (view, options = { preventDestroy: true }) {
        if(this.hasView()){
            this.stopListening(this.currentView, CLOSE_REGION);
        }

        this.listenTo(view, CLOSE_REGION, ()=>{
            this.empty();
        });

        Marionette.Region.prototype.show.call(this, view, options);

        return this;
    },

    empty() {
        Marionette.Region.prototype.empty.call(this);
        this.trigger('close');
    }

});
