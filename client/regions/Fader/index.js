import css from './style.scss';
import animationEnd from 'utils/animation-end';
import Marionette from 'marionette';
import TransitionRegion from 'regions/Transition';

export default TransitionRegion.extend({

    regionDataType : 'fader-region',
    animationInClassName : 'fader-region-in',
    animationOutClassName : 'fader-region-out'

});



