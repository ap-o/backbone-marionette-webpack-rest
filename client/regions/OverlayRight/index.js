import css from './style.scss';
import Marionette from 'marionette';
import TransitionRegion from 'regions/Transition';

export default TransitionRegion.extend({

    regionDataType : 'overlay-right-region',
    animationInClassName : 'overlay-right-region-in',
    animationOutClassName : 'overlay-right-region-out',

    blockerInClassName : 'overlay-blocker-in',
    blockerOutClassName : 'overlay-blocker-out',

    initialize () {
        this.$content = $('<div class="region-content"/>');
        this.$blocker = $('<div class="blocker"/>');
        this.$blocker.on('click', ()=>{
            this.empty();
        });
    },

    attachHtml (view) {
        this.$el.append(this.$content);
        this.$el.append(this.$blocker);
        this.$blocker
            .removeClass(this.blockerOutClassName)
            .addClass(this.blockerInClassName);

        this.$content.append(view.$el);
        view.$el.addClass(this.animationInClassName);
        return this;
    },


    empty() {
        this.$blocker
            .removeClass(this.blockerInClassName)
            .addClass(this.blockerOutClassName);

        TransitionRegion.prototype.empty.call(this);
    }

});
