import _ from 'lodash';
import radio from 'radio';
import Backbone from 'backbone';
import Marionette from 'marionette';

import UserModel from './User';

import {
    APP_CHANNEL,
    APP_LOADING_START,
    APP_LOADING_END,
    APP_USER_CHANNEL,
    APP_USER_FETCH,
    APP_USER_FETCH_SUCCESS,
    APP_USER,
    APP_USER_IS_AUTHENTICATED,
    APP_USER_LOGIN,
    APP_USER_LOGIN_SUCCESS,
    APP_USER_LOGIN_ERROR,
    APP_USER_SIGNUP,
    APP_USER_SIGNUP_SUCCESS,
    APP_USER_SIGNUP_ERROR,
    APP_USER_LOGOUT,
    APP_USER_LOGOUT_SUCCESS,
    APP_USER_LOGOUT_ERROR } from 'constants';

let userChannel = radio.channel(APP_USER_CHANNEL);

let AppUser = UserModel.extend({


    initialize () {

        userChannel.reply(APP_USER_FETCH, ()=>{
            this.getSessionUser();
        });

        userChannel.reply(APP_USER, ()=>{
            return this;
        });

        userChannel.reply(APP_USER_IS_AUTHENTICATED, ()=>{
            return this.isAuthenticated();
        });

        userChannel.reply(APP_USER_LOGIN, (credentials)=>{
            return this.login(credentials);
        });

        userChannel.reply(APP_USER_LOGOUT, ()=>{
            return this.logout();
        });

    },

    getSessionUser () {
        let fetchXhr = this.fetch({
            success: ()=> {
                userChannel.trigger(APP_USER_FETCH_SUCCESS, this);
                userChannel.trigger(APP_USER_LOGIN_SUCCESS, this);
            },
            error: ()=> {
                userChannel.trigger(APP_USER_FETCH_SUCCESS, this);
            }
        });
    },

    login (credentials, callbacks) {
        let loginXhr = UserModel.prototype.fetch.call(this, {
            type: 'POST',
            data: credentials,
            success : (data)=> {
                this.set(data);
                userChannel.trigger(APP_USER_LOGIN_SUCCESS, this);
            },
            error : (error)=> {
                userChannel.trigger(APP_USER_LOGIN_ERROR, error);
            }
        });

        return loginXhr;
    },

    logout () {

        return $.ajax({
            url:this.urlRoot+'/logout',
            type:'GET',
            dataType:"json",
            success : (data)=> {
                userChannel.trigger(APP_USER_LOGOUT_SUCCESS, data);
            },
            error : (error)=> {
                userChannel.trigger(APP_USER_LOGOUT_ERROR, error);
            }
        });
    },

    isAuthenticated () {
        return this.id ? true : false;
    },


    toJSON (){
        var out = UserModel.prototype.toJSON.call(this);
        out.isAuthenticated = this.isAuthenticated();
        return out;
    }


});

export const appUser = new AppUser();
