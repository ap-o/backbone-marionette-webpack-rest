import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';

import {
    API
} from 'settings';

export default Backbone.Model.extend({

        idAttribute: '_id',

        urlRoot: API.URI + "user",

        defaults : {
            firstname: '',
            lastname: '',
        },

        getEmail () {
            return this.get('email');
        },

        getModified () {
            return this.get('modified');
        },

        getName () {
            return this.getFirstName() + ' ' + this.getLastName();
        },

        getFirstName () {
            return this.get('firstname');
        },

        getLastName () {
            return this.get('lastname');
        },

        getInitials () {
            return this.getFirstName().substr(0,1)+this.getLastName().substr(0,1);
        },

        toJSON : function(){
            var out = Backbone.Model.prototype.toJSON.call(this);
            out.initials = this.getInitials();
            return out;
        }


    });
