import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';

import {
    API
} from 'settings';

export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: API.URI + "todo",

    defaults:{
        completed:false
    },

    destroy (options) {
        options = options || {};

        return $.ajax({
            url:this.urlRoot+'/'+this.id+'/archive',
            type:'GET',
            dataType:"json",
            success : (data)=> {
                this.stopListening();
                this.trigger('destroy', this, this.collection, options)
                if(options.success) options.success();
            },
            error : (error)=> {
                if(options.error) options.error();
            }
        });
    }
});
