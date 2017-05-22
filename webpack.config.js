'use strict';

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    externals: [ nodeExternals() ],
    context: path.join(__dirname, 'src'),
    entry: 'main.ts',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [ 
            path.join(__dirname, 'src'), 
            path.join(__dirname, 'node_modules') 
        ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ }
        ]
    }
};