import Marionette from 'marionette';

import LoadingView from 'behaviors/LoadingView';
import EmptyView from 'components/Empty';
import FolderCreateView from 'components/CreateForm';
import FolderModel from 'models/Folder';
import FolderItem from 'components/FolderItem';

import css from './style.scss';
import tpl from './template.nunj';

export default Marionette.CompositeView.extend({

    template: tpl,

    childView: FolderItem,

    childViewContainer: '[data-container="folder-list-container"]',

    emptyView: EmptyView,

    emptyViewOptions: {
        title: "Nothing here",
        subtitle: "Make your first folder!",
        tagName: "div"
    },

    attributes: {
        'data-view': 'foler-list-view'
    },

    behaviors: {
        preloaded: {
            behaviorClass: LoadingView
        }
    },

    childViewOptions (child, index) {
        return {
            index: index,
            length: this.collection.length
        };
    }

});
