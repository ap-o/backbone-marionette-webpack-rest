var path = require('path');
var webpack = require('webpack');
var assetsPath = path.join(__dirname, '..', 'public', 'assets');
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    // eval - Each module is executed with eval and //@ sourceURL.
    devtool: 'eval',
    // The configuration for the client
    name: 'browser',
    /* The entry point of the bundle
     * Entry points for multi page app could be more complex
     * A good example of entry points would be:
     * entry: {
     *   pageA: "./pageA",
     *   pageB: "./pageB",
     *   pageC: "./pageC",
     *   adminPageA: "./adminPageA",
     *   adminPageB: "./adminPageB",
     *   adminPageC: "./adminPageC"
     * }
     *
     * We can then proceed to optimize what are the common chunks
     * plugins: [
     *  new CommonsChunkPlugin("admin-commons.js", ["adminPageA", "adminPageB"]),
     *  new CommonsChunkPlugin("common.js", ["pageA", "pageB", "admin-commons.js"], 2),
     *  new CommonsChunkPlugin("c-commons.js", ["pageC", "adminPageC"]);
     * ]
     */
    // context: path.join(__dirname, '..', 'client'),
    // Multiple entry with hot loader
    // https://github.com/glenjamin/webpack-hot-middleware/blob/master/example/webpack.config.multientry.js
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
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].js',
      // The output path from the view of the Javascript
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

        // Alias marionette to backbone.marionette to reduce the amount of typing in import statements
        marionette: 'backbone.marionette',

        // Alias wreqr to backbone.wreqr to reduce the amount of typing in import statements
        wreqr: 'backbone.wreqr',

        // Alias radio to backbone.radio to reduce the amount of typing in import statements
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

        // Create an explicit vendor commons chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        })
    ]
};
