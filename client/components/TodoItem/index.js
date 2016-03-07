import _ from 'lodash';
import moment from 'moment';
import Backbone from 'backbone';
import Marionette from 'marionette';

import css from './style.scss';
import tpl from './template.nunj';

export default Marionette.ItemView.extend({

    template: tpl,

    tagName : 'dt',

    attributes: {
        'data-view': 'todo-item-view'
    },

    events :{
        'click': 'onClick',
        'click .bin': 'onBinClick',
    },

    onRender () {
        this.toggleCompleted();
        this.animateIn();
    },

    onClick (evt) {
        let completed = this.model.get('completed');
        this.model.save({completed:!completed}, {wait:false});
        this.toggleCompleted();
    },

    toggleCompleted () {
        this.$el.toggleClass('completed', this.model.get('completed'));
    },

    onBinClick (evt) {
        this.animateOut(()=>{
            this.model.destroy();
        })

        evt.preventDefault();
        evt.stopPropagation();
    },

    animateIn (callback) {
        let delay = this.options.index * 40;
        this.$el.velocity({
            opacity: 1,
            tween: [0, -30 ]
        },
        {
            delay: delay,
            duration: 1000,
            easing: [0.190, 1.000, 0.220, 1.000],
            progress: (elements, progress, time, start, tween)=>{
                this.$el.css("transform","translateY("+tween+"px)");
            },
            complete: () =>{
                if(callback)
                    callback();

            }
        });
    },

    animateOut (callback) {
        let delay = this.options.index * 40;
        this.$el.velocity({
            opacity: 0,
            translateY: '-10px'
        },
        {
            delay: delay,
            duration: 600,
            easing: [0.190, 1.000, 0.220, 1.000]
        });

        this.$el.velocity("slideUp",
        {
            delay: delay,
            duration: 800,
            easing: [0.190, 1.000, 0.220, 1.000],
            queue: false,
            complete: () =>{
                if(callback)
                    callback();

            }
        });
    }

});
