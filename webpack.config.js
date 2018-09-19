const path =require("path");
// const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getHtmlConfig = (name) => {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
}
const config = {
    entry: {
        common: ["./src/page/common/common.js", "webpack-dev-server/client?http://localhost:8080/"],
        index: "./src/page/index/index.js",
        login: "./src/page/login/index.js"
    },
    output: {
        path: __dirname + "/dist/",
        publicPath: "/dist/",
        filename: "[name].js"
    },
    optimization: {
        splitChunks: {
            chunks: 'async',//默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
            minSize: 30000,//合并前模块文件的体积
            minChunks: 1,//最少被引用次数
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',//自动命名连接符
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    minChunks:1,//敲黑板
                    priority: -10//优先级更高
                },
                commons: {
                    name: "common",
                    chunks: "all",
                    minChunks: 1
                }
            }
        }
    },
   /* // 引入全局的jQuery，可行
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
        }),
    ]*/
   plugins: [
       new MiniCssExtractPlugin({
           filename: "css/[name].css",
           chunkFilename: "[id].css"
       }),
       new HtmlWebpackPlugin(getHtmlConfig('index')),
       new HtmlWebpackPlugin(getHtmlConfig('login')),
   ],
   module: {
       //全局引入jQuery，可行，安装expose-loader，配置如下
        rules: [
           {
               test: require.resolve('jquery'),
               use: [{
                   loader: 'expose-loader',
                   options: 'jQuery'
               },{
                   loader: 'expose-loader',
                   options: '$'
               }]
           },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(png|git|jpg|svg|ttf|wff|eot)$/,
                use: "url-loader?limit=100&name=resource/[name].[ext]"
            }
       ]
   }
};
module.exports = config;