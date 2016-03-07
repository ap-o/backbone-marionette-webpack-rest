import Backbone from 'backbone';
import Marionette from 'marionette';

export default Marionette.Behavior.extend({

    ui: {
        'link': 'a[href]'
    },

    events: {
        'click @ui.link': 'onLinkClick'
    },

    onLinkClick (evt) {
        evt.preventDefault();
        let $anchor = Backbone.$(evt.currentTarget),
            href = $anchor.attr('href').replace(/^\/+/, '').replace(/\/+$/, ''),
            rel = $anchor.attr('rel');

        if(href===undefined)
            return;

        if(!$anchor.hasClass('disabled')){
            if(rel === "external" || href.substring(0, 7) === "http://"  || href.substring(0, 8) === "https://"){
                var isHttp = href.substr(0,7) === 'http://';
                var isHttps = href.substr(0,8) === 'https://';
                if(!isHttp && !isHttps) href = 'http://'+href;

                if( ("standalone" in window.navigator) && window.navigator.standalone ){
                    var a = document.createElement('a');
                    a.setAttribute("href", href);
                    a.setAttribute("target", "_blank");

                    var dispatch = document.createEvent("HTMLEvents");
                    dispatch.initEvent("click", true, true);
                    a.dispatchEvent(dispatch);
                }else{
                    window.open(href, "_blank");
                }

            }else{
                Backbone.history.navigate(href, {trigger: true});
            }
        }
    }

});
