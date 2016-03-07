import _ from 'lodash';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';

import {
    APP_CHANNEL,
    APP_NOTIFICATION } from 'constants';

import {
    API } from 'settings';

export default Backbone.Collection.extend({
    model: Backbone.Model,

    endpoint: "model/list",

    initialize : function(models, options){
        this.options = options || {};
    },

    url (){
        return API.URI + this.endpoint;
    },

    fetch (options){
        options = options || {};

        var add = true,
            remove = true;

        return Backbone.Collection.prototype.fetch.call(this, {
            type: 'POST',
            add: add,
            remove: remove,
            data: this.options.data,
            success : (data)=> {
                if(options.success) options.success();
            },
            error : (error)=> {
                if(options.error) options.error();
            }
        });
    }

});
