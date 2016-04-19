var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './www/js/app/main.es6',
    output: {
        path: './www/js/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    /*watch: true,*/
    module: {
        loaders: [
            {
                test: /(\.jsx?|\.es6)$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            }
        ]
    }
};