import _ from 'lodash';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';

import FaderRegion from 'regions/Fader';

import LoadingView from 'behaviors/LoadingView';

import FolderListView from 'components/FolderList';
import FolderCreateView from 'components/CreateForm';

import FolderModel from 'models/Folder';
import FolderItem from 'components/FolderItem';

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
        foldercreate: {
            selector: '[data-region="folder-create"]',
            regionClass: FaderRegion
        },
        folderlist: {
            selector: '[data-region="folder-list"]',
            regionClass: FaderRegion
        }
    },


    onShow () {
        let foldercreateview = new FolderCreateView({placeholder:"Create Folder"});
        this.foldercreate.show(foldercreateview);

        let folderlistview = new FolderListView({collection:this.collection});
        this.folderlist.show(folderlistview);

        this.listenTo(foldercreateview, 'create', _.bind(this.onCreate, this));
    },

    onCreate (title){
        let newFolder = new FolderModel({
            title:title,
        });

        newFolder.save({},{
            success: ()=>{
                this.collection.add(newFolder, {at:0});
            }
        });
    },
});
