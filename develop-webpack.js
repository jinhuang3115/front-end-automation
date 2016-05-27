/**
 * Created by jin on 16/3/16.
 */
const path = require('path');
const webpack = require('webpack');
//分包
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js'
});
//压缩
const UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
    }
});
module.exports = {
   // watch: true, //监听是否启动
    entry: {
        vendor: ['react', 'react-dom'],
        login: 'login'
    },
    output: {
     //   path: 'dist',
        filename: '[name].js',
        publicPath: "",
        chunkFilename: "[name].chunk.js",
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.jsx'],
        alias: {
            'login': 'js/page/login' //文件别名，方便调用
        }

    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: '/node_modules/',
                query: {
                    presets: ['react', 'es2015'] //编译react和es2015标准编译
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff|ttf|eot)$/i,
                loaders: ['url-loader?limit=1000&name=[path][name][hash:8].[ext]', 'img?minimize'] //图片及字体文件处理
            },
            {
                test: /\.(scss|css)/,
                loaders: ['style', 'css', 'autoprefixer-loader', 'sass'] //sass文件处理
            },
            {test: /\.js$/, loader: "eslint-loader", exclude: [/node_modules/, /js\/lib/]} //代码格式检查
        ],
        noParse: []
    },
    plugins: [
        commonsPlugin,
        UglifyJsPlugin],//使用插件
    imagemin: {
        gifsicle: {interlaced: false},
        jpegtran: {
            progressive: true,
            arithmetic: false
        },
        optipng: {optimizationLevel: 5},
        pngquant: {
            floyd: 0.5,
            speed: 2
        },
        svgo: {
            plugins: [
                {removeTitle: true},
                {convertPathData: false}
            ]
        }
    },
    eslint: {
        configFile: '.eslintrc',
        ignorePath: '.eslintignore'
    }
};
