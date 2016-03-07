import _ from 'lodash';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';

import FaderRegion from 'regions/Fader';
import LoadingView from 'behaviors/LoadingView';

import TodoCreateView from 'components/CreateForm';
import TodoListView from 'components/TodoList';
import TodoCollection from 'collections/Todos';
import TodoModel from 'models/Todo';

import css from './style.scss';
import tpl from './template.nunj';

import {
    APP_CHANNEL,
    APP_NOTIFICATION } from 'constants';

export default Marionette.LayoutView.extend({

    template: tpl,

    tagName: 'article',

    attributes: {
        'data-view': 'home-view'
    },

    behaviors: {
        preloaded: {
            behaviorClass: LoadingView
        }
    },

    regions: {
        todocreate: {
            selector: '[data-region="todo-create"]',
            regionClass: FaderRegion
        },
        todolist: {
            selector: '[data-region="todo-list"]',
            regionClass: FaderRegion
        }
    },

    onRender () {
        this.todocollection = new TodoCollection([], {
            data:{
                folder:this.model.id}
            });

        let todocreateview = new TodoCreateView({placeholder:"New Todo"});
        this.todocreate.show(todocreateview);

        this.listenTo(todocreateview, 'create', _.bind(this.onCreate, this));

        let todolistview = new TodoListView({collection:this.todocollection, preload:true});
        this.todolist.show(todolistview);
    },

    onCreate (title){
        let newTodo = new TodoModel({
            title:title,
            folder:this.model.id
        });

        newTodo.save({},{
            success: ()=>{
                this.todocollection.add(newTodo, {at:0});
            }
        });
    }


});
