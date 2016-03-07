import animationEnd from 'utils/animation-end';
import Marionette from 'marionette';
import BaseRegion from 'regions/Base';

export default BaseRegion.extend({

    regionDataType : '',
    animationInClassName : '',
    animationOutClassName : '',


    attachHtml (view) {
        view.$el.addClass(this.animationInClassName);
        this.$el.append(view.$el);
        return this;
    },

    destroyView (view, callback) {
        view.$el
            .one(animationEnd, () => {
                view.destroy();
                if(callback)
                    callback();
            })
            .removeClass(this.animationInClassName)
            .addClass(this.animationOutClassName);
    },

    show (view, options = { preventDestroy: true }) {

        if(this.hasView()){
            this.destroyView(this.currentView);
        }

        BaseRegion.prototype.show.call(this, view, options);
        view.$el.attr('data-region-content', this.regionDataType);
        this.$el.attr('data-region-type', this.regionDataType);

        return this;
    },

    empty() {
        if(this.hasView()){
            this.destroyView(this.currentView, () => {
                BaseRegion.prototype.empty.call(this);
            });
        }
    }

});
