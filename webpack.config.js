var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        main: './web/js/app/main.js',
        admin: './web/js/app-admin/admin-main.js'
    },
    output: {
        path: './web/js/',
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
                }
            }
        ]
    }
};