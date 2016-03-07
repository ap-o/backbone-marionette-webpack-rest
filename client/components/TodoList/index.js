import Backbone from 'backbone';
import Marionette from 'marionette';

import css from './style.scss';
import tpl from './template.nunj';

import LoadingView from 'behaviors/LoadingView';
import EmptyView from 'components/Empty';
import TodoItem from 'components/TodoItem';

export default Marionette.CompositeView.extend({

    template: tpl,

    childView: TodoItem,

    childViewContainer: '[data-container="todo-list-container"]',

    emptyView: EmptyView,

    emptyViewOptions: {
        title: "Nothing here",
        subtitle: "Add your first todo!"
    },

    attributes: {
        'data-view': 'todo-list-view'
    },

    behaviors: {
        preloaded: {
            behaviorClass: LoadingView
        }
    },

    serializeData () {
        console.log(this.isEmpty());
    },

    childViewOptions (child, index) {
        return {
            index: index,
            length: this.collection.length
        };
    }
});
