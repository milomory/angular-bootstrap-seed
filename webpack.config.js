/**
 * Created by niko on 21.09.16.
 */

const NODE_ENV = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '7001';

const webpack = require('webpack');
const rimraf = require('rimraf');
const path = require('path');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const BowerWebpackPlugin = require('bower-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = webpack.DefinePlugin;
const ProvidePlugin = webpack.ProvidePlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var paths = {
    context: path.join(__dirname, 'sources'),
    dist: path.join(__dirname, 'dist'),
    static: path.join(__dirname, 'static')
};

var webpackConfig = {
    context: paths.context,
    entry: {
        vendor: './vendor',
        app: './app'
    },
    output: {
        path: paths.dist,
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        modulesDirectories: ['bower_components', 'node_modules'],
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(bower_components|node_modules)/,
                loader: 'ng-annotate!babel'
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.(png|jpe|gif|svg|woff|ttf|eot|ico)([?]?.*)$/,
                include: /(bower_components|node_modules)/,
                loader: 'url?name=[1][name].[ext]&limit=524288&regExp=(bower_components|node_modules)/(.*)'
            },
            {
                test: /\.(png|jpe|gif|svg|woff|ttf|eot|ico)([?]?.*)$/,
                exclude: /(bower_components|node_modules)/,
                loader: 'url?name=[path][name].[ext]&limit=524288'
            }
        ],
        noParse: [
            /socket.io-client/,
        ]
    },
    plugins: [
        {
            apply: (compiler) => (rimraf.sync(compiler.options.output.path))
        },
        new CommonsChunkPlugin({
            name: ['app', 'vendor'],
            minChunks: 2
        }),
        new BowerWebpackPlugin({
            includes: /\.(js|css)/
        }),
        new HtmlWebpackPlugin({
            template: path.join(paths.context, 'index.html')
        }),
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('[name].bundle.css', {
            allChunks: true
        }),
        new CopyWebpackPlugin([
            {
                from: paths.static
            }
        ])
    ]
};

if (NODE_ENV == 'development') {
    webpackConfig.devServer = {
        contentBase: paths.dist,
        host: HOST,
        port: PORT,
        inline: true,
        stats: 'minimal',
        historyApiFallback: true
    };

    webpackConfig.devtool = 'cheap-inline-module-source-map';
    webpackConfig.watch = true;
}

if (NODE_ENV == 'production') {
    webpackConfig.plugins.push(new UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true
        }
    }));
}

module.exports = webpackConfig;