var _ = require('lodash');
var webpack = require('webpack');
var devConfig = require('./webpack.config.dev');

var distConfig = _.extend({}, devConfig);

// Remove the hot module stuff from main.js
entry: {
    app: ['main']
};

// turn off js sourcemaps
delete distConfig.devtool;

// Modify the plugins array
distConfig.plugins = distConfig.plugins.concat(

    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),

    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // }),

    new webpack.optimize.DedupePlugin()
);


module.exports = distConfig;
