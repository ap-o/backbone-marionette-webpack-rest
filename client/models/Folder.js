import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';

import {
    API
} from 'settings';

export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: API.URI + "folder",

    defaults:{
        completed:false
    }
});
