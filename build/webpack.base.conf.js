var path = require('path')
var webpack = require('webpack');
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        modules: [path.resolve(__dirname, '../src'),'node_modules'],
        alias: {
            'webvr-ui': "webvr-ui/build/webvr-ui",
            'fonts': path.resolve(__dirname, '../src/fonts'),
            'views': path.resolve(__dirname, '../src/js/views'),
            'models': path.resolve(__dirname, '../src/models'),
            'shaders': path.resolve(__dirname, '../src/js/shaders'),
            'sounds': path.resolve(__dirname, '../src/sounds'),
            'textures': path.resolve(__dirname, '../src/textures'),
        }
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'src/fonts/', to: 'assets/fonts/'},
            {from: 'src/models/', to: 'assets/models/'},
            {from: 'src/sounds/', to: 'assets/sounds/'},
            {from: 'src/textures/', to: 'assets/textures/'},
        ]),
        new webpack.ProvidePlugin({
            'THREE': 'three'
        }),
    ],
    module: {
        rules: [
            {
                test: require.resolve("three/examples/js/vr/WebVR"),
                use: 'exports-loader?WEBVR'
            },
            {
                test: /\.js$/,
                include: projectRoot,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    compact: true,
                    presets: [
                        ['es2015', {modules: false}]
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
            { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ },
            { test: /node_modules/, loader: 'ify-loader' },
            { test: /\.json$/, loader: 'json-loader' },
        ]
    }
}