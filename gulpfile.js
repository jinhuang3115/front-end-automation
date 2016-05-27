/**
 * Created by jin on 16/3/4.
 */
const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify'); //代码压缩
const concat = require('gulp-concat'); //代码合并
const scp = require('gulp-scp2'); //远程scp
const webpackStream = require('webpack-stream'); //配合webpack
const productConfig = require('./product-webpack'); //webpack配置
const rev = require('gulp-rev'); //静态文件指纹
const revreplace = require('gulp-rev-replace'); //替换带指纹文件名
const clean = require('gulp-clean'); //清空
const runSequence = require('run-sequence');//执行顺序
const watch = require('gulp-watch'); //监听
const through = require('through2'); //流文件处理
const deployPath = 'XXX/XXX/XXX';
const host = 'xx.x.xx.x';
const username = 'xxx';
const password = 'xxxxxxxx';

//第三方文件不用webpack处理，并且仅在IE中使用
gulp.task('third', function () {
    'use strict';
    let rootPath = './js/third';
    return gulp.src([rootPath + '/es5-shim.min.js', rootPath + '/es5-sham.min.js'])
        .pipe(concat('ie.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/static'))
        .pipe(rev.manifest('dist/static/rev-manifest.json', {base: 'dist/static', merge: true}))
        .pipe(gulp.dest('dist/static'))
});

//jquery不用webpack处理
gulp.task('jquery', function () {
    'use strict';
    let rootPath = './js/third';
    return gulp.src([path.resolve(rootPath, 'jquery.js')])
        .pipe(concat('jquery.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/static'))
        .pipe(rev.manifest('dist/static/rev-manifest.json', {base: 'dist/static', merge: true}))
        .pipe(gulp.dest('dist/static'))
});

//JSP文件处理，替换文件指纹名称
gulp.task('jsp', function () {
    var manifest = gulp.src("dist/static/rev-manifest.json");
    return gulp.src(['template/*'])
        .pipe(revreplace({replaceInExtensions: ['.jsp', '.html'], manifest: manifest}))
        .pipe(gulp.dest('dist'));
});
//图片和字体不添加指纹
function slove() {
    return through.obj(function (file, enc, cb) {
        var history = file.history.join('');
        if (history.indexOf('font') === -1 && history.indexOf('images') === -1) {
            this.push(file);
        }
        return cb();
    })
}
//webpack流文件处理
gulp.task('stream', function () {
    return gulp.src(['js/**/*.js', 'css/*.scss'])
        .pipe(webpackStream(productConfig))
        .pipe(gulp.dest('dist/static'))
        .pipe(slove())
        .pipe(rev())
        .pipe(gulp.dest('dist/static'))
        .pipe(rev.manifest('dist/static/rev-manifest.json', {base: 'dist/static', merge: true}))
        .pipe(gulp.dest('dist/static'))
});

//开发环境
gulp.task('thirdDev', function () {
    'use strict';
    let rootPath = './js/third';
    return gulp.src([rootPath + '/es5-shim.min.js', rootPath + '/es5-sham.min.js'])
        .pipe(concat('ie.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(scp({ //发送到远程服务器进行调试
            host: host,
            username: username,
            password: password,
            dest: deployPath,
            watch: function (client) {
                client.on('write', function (o) {
                    console.log('write %s', o.destination);
                });
            }
        }))
        .on('error', function (err) {
            console.log(err);
        });
});

gulp.task('jqueryDev', function () {
    'use strict';
    let rootPath = './js/third';
    return gulp.src([path.resolve(rootPath, 'jquery.js')])
        .pipe(concat('jquery.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(scp({
     host: host,
     username: username,
     password: password,
     dest: deployPath,
     watch: function (client) {
     client.on('write', function (o) {
     console.log('write %s', o.destination);
     });
     }
     }))
     .on('error', function (err) {
     console.log(err);
     });
});

gulp.task('streamDev', function () {
    return gulp.src(['js/**', 'css/*.scss'])
        .pipe(webpackStream(productConfig))
        .pipe(gulp.dest('dist'))
      .pipe(scp({
     host: host,
     username: username,
     password: password,
     dest: deployPath,
     watch: function (client) {
     client.on('write', function (o) {
     console.log('write %s', o.destination);
     });
     }
     }))
     .on('error', function (err) {
     console.log(err);
     });
});

gulp.task('jspDev', function () {
    return gulp.src(['template/*'])
        .pipe(watch(['template/*']))
        .pipe(gulp.dest('dist'))
     .pipe(scp({
     host: host,
     username: username,
     password: password,
     dest: deployPath,
     watch: function (client) {
     client.on('write', function (o) {
     console.log('write %s', o.destination);
     });
     }
     }))
     .on('error', function (err) {
     console.log(err);
     });
});

//生产环境使用，测试
gulp.task('production', function (callback) {
    runSequence('third', 'jquery', 'stream', 'jsp');
});

//开发环境使用 不压缩
 gulp.task('dev', function () {
    runSequence('thirdDev', 'jqueryDev', 'jspDev','streamDev');
 });
