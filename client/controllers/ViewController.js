import Marionette from 'marionette';
import _ from 'lodash';
import radio from 'radio';

import AboutView from 'containers/About';
import ProfileView from 'containers/Profile';
import HomeView from 'containers/Home';
import LoginView from 'containers/Login';
import UserModel from 'models/User';

import FolderView from 'containers/Folder';
import FolderModel from 'models/Folder';
import FolderCollection from 'collections/Folders';

import {
    APP_USER_CHANNEL,
    APP_USER_IS_AUTHENTICATED,
    APP_USER_LOGOUT,
    APP_USER_LOGOUT_SUCCESS } from 'constants';

let userChannel = radio.channel(APP_USER_CHANNEL);


export default Marionette.Controller.extend({

    // we hold
    mainRoute : 'home',

    initialize () {

        this.rootView = this.options.rootView;
        this.rootView.main.on('show', ()=>{ this.onMainShow(); });
        this.rootView.rightAside.on('show', ()=>{ this.onRightAsideShow(); });
        this.rootView.rightAside.on('empty', ()=>{ this.onRightAsideEmpty(); });

        userChannel.on(APP_USER_LOGOUT_SUCCESS,()=>{
            window.location.href = '/';
            window.location.reload(true);
        });

    },


    login (route, region) {
        let loginview = new LoginView();
        this.show(loginview, region, route);
    },

    home (route, region) {
        let homeView = new HomeView();
            this.show(homeView, region, route);
    },

    lists (route, region) {
        let homeView = new HomeView();
            this.show(homeView, region, route);
    },

    home (route, region) {
        let folderCollection = new FolderCollection(),
            homeView = new HomeView({collection:folderCollection, preload:true});
            this.show(homeView, region, route);
    },

    folder (route, region, folderid) {
        let foldermodel = new FolderModel({_id:folderid}),
            folderView = new FolderView({model:foldermodel});

        this.show(folderView, region, route);
    },

    profile (route, region) {
        let profileview = new ProfileView();
            this.show(profileview, region, route);
    },

    about (route, region) {
        let aboutView = new AboutView();
            this.show(aboutView, region, route);
    },

    notFound (route, region) {
        this.goHome();
    },

    goLogin () {
        this.home('home', 'main');
    },

    goHome () {
        this.home('home', 'main');
    },

    show (view, region, route){
        if(region==='main'){
            this.mainRoute = route;
        }
        this.rootView.regionManager.get(region).show(view);
    },

    onMainShow ( ) {
        this.closeOverlays();
    },

    onRightAsideShow () {
        this.scrollLock();

        if(this.isMainEmpty()){

        }
    },

    onRightAsideEmpty () {
        this.scrollLock(false);
        Backbone.history.navigate(this.mainRoute, {trigger:false});
    },

    scrollLock (lock = true) {
        $('html').toggleClass('scroll-lock', lock);
    },

    scrollToTop () {
        $("html").velocity("scroll", {
            duration: 300,
            easing: [0.190, 1.000, 0.220, 1.000],
            offset: 0
        });
    },

    closeOverlays () {
        if(this.isRightAsideOpen()){
            this.rootView.rightAside.empty();
        }
    },

    isRightAsideOpen () {
        return _.isUndefined(this.rootView.rightAside.currentView) ? false : true;
    },

    isMainEmpty () {
        return _.isUndefined(this.rootView.main.currentView) ? true : false;
    }


});
