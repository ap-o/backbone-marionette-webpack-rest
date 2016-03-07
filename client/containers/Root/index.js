import radio from 'radio';
import Marionette from 'marionette';

import Velocity from 'velocity-animate';

import BaseRegion from 'regions/Base'
import FaderRegion from 'regions/Fader';
import OverlayRightRegion from 'regions/OverlayRight';

import HeaderView from 'components/Header';
import FooterView from 'components/Footer';

import css from './style.scss';
import tpl from './template.nunj';

import {
    APP_CHANNEL,
    APP_LOADING_START,
    APP_LOADING_END } from 'constants';

export default Marionette.LayoutView.extend({

    el: 'body',

    template: tpl,

    regions: {

        main: {
            selector: '[data-region="root-main"]',
            regionClass: FaderRegion
        },

        rightAside: {
            selector: '[data-region="root-right-aside"]',
            regionClass: OverlayRightRegion
        },

        header: {
            selector: '[data-region="root-header"]',
            regionClass: BaseRegion
        },

        footer: {
            selector: '[data-region="root-footer"]',
            regionClass: BaseRegion
        },
    },

    initialize () {
        this.$el.attr('data-layout', 'Root');

        radio.on(APP_CHANNEL, APP_LOADING_START, ()=>{
        });
        radio.on(APP_CHANNEL, APP_LOADING_END, ()=>{
        });
    },

    onRender () {
        this.header.show(new HeaderView());
        this.footer.show(new FooterView());
    }

});
