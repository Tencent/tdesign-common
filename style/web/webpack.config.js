const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode:'development',
    entry:'./index.js',
    output:{
        filename:'[name].js',
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use: [
                    //MiniCssExtractPlugin.loader,
                    'css-loader',
                  ],
           },{
                test: /\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ] // 将 Less 编译为 CSS
            },
            {
                test:/\.js$/,
                use: {
                    loader: 'babel-loader',
                    options:{
                        "presets": [
                            "@babel/preset-env","@babel/react"
                        ]   
                    }
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins:[
        // 单独分离css
        new MiniCssExtractPlugin({
            filename: 'tdesign.css',
        }),
        
        // 压缩css
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })
    ],
    devServer: {
        contentBase:  './',
        compress: true,
        port: 9000,
        open:false,
        writeToDisk: true,
        stats: 'errors-only',
    },
}