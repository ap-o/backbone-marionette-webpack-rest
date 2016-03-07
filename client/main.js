import 'main.scss';
import $ from 'jquery';
import Velocity from 'velocity-animate';

import moment from 'moment';

import Marionette from 'marionette';
import Application from 'Application';

// Override the default Marionette renderer to call template.render() to work with nunjucks-loader templates.
Marionette.Renderer.render = function(template, data) {
    if (!template) {
        throw new Marionette.Error({
          name: 'TemplateNotFoundError',
          message: 'Cannot render the template since its false, null or undefined.'
        });
    }
    data.moment = moment;
    return template.render(data);
};


$((window) => {
    let app = new Application();
    app.start();
});
