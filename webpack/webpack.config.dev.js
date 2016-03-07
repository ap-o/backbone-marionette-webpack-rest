var path = require('path');
var webpack = require('webpack');
var assetsPath = path.join(__dirname, '..', 'public', 'assets');
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'eval',
    name: 'browser',

    entry: {
      app: ['main', hotMiddlewareScript],

      vendor: [
        'lodash',
        'jquery',
        'marionette',
        'radio',
        'velocity',
        'nunjucks-loader/runtime-shim',
        'nunjucks/browser/nunjucks-slim'
      ]
    },

    output: {
      path: assetsPath,
      filename: '[name].js',
      publicPath: '/assets/'
    },

    module: {
        noParse: [
            /lodash/,
            /nunjucks\-slim/
        ],

        loaders: [
        {
            test: /\.js$|\.jsx$/,
            exclude: /node_modules/,
            loaders: ['babel']
        },
        {
            test: /\.(jpg|gif|png)?$/,
            exclude: /node_modules/,
            loader: 'file-loader'
        },

        {
            test: /\.(nunj|nunjucks)?$/,
            exclude: /node_modules/,
            loader: 'nunjucks'
        },

        {
            test: /\.(svg|eot|svg|ttf|woff|woff2)$/,
            exclude: /node_modules/,
            loader: 'file'
        },
        {
            test: /\.(css|scss|sass)?$/,
            loader: ExtractTextPlugin.extract('css!autoprefixer-loader!sass?sourceMap&outputStyle=expanded')
        },
        {
            test: require.resolve('backbone.marionette'),
            loader: 'expose?Marionette'
        },
        {
            test: /\velocity\.min\.js/,
            loader: "expose?Velocity"
        }

      ]
    },


    resolve: {
      root: __dirname,

      extensions: ['', '.js', '.jsx', '.scss'],

      modulesDirectories: [
        'node_modules', 'client'
      ],

      alias: {

        marionette: 'backbone.marionette',

        wreqr: 'backbone.wreqr',

        radio: 'backbone.radio',

        velocity: 'velocity-animate'
      }

    },

    plugins: [

        new webpack.HotModuleReplacementPlugin(),

        new webpack.NoErrorsPlugin(),

        // Use lodash in place of underscore
        new webpack.NormalModuleReplacementPlugin(/underscore/, 'lodash'),

        // Write CSS to a styles.css file
        new ExtractTextPlugin('styles.css'),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "root.jQuery": "jquery"
       }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        })
    ]
};
