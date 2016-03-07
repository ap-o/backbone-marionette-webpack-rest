var _ = require('lodash');
var webpack = require('webpack');
var devConfig = require('./webpack.config.dev');

var distConfig = _.extend({}, devConfig);

entry: {
    app: ['main']
};

delete distConfig.devtool;

distConfig.plugins = distConfig.plugins.concat(

    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),

    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),

    new webpack.optimize.DedupePlugin()
);


module.exports = distConfig;
