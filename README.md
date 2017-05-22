## 前端工程化

#### 工程化采用的是webpack+gulp的架构
#### webpack
##### webpack-loader:
1. babel:编译react和es2015
2. url-loader,imagemin:静态文件处理（图片、字体压缩等）
3. style,css,autoprefixer-loader,sass：样式处理
4. eslint-loader：代码规范检查

##### webpack-plugins
1. commonChunkPlugin：分包
2. UglifyJsPlugin：代码压缩

#### gulp
1. gulp-uglify：代码压缩
2. gulp-concat：代码合并
3. gulp-scp2：远程发送代码
4. webpack－stream：配合webpack
5. gulp-rev：静态文件加指纹
6. run-sequence：执行顺序
7. watch: 监听本地文件
8. through2：流文件处理


由于有些文件需要特殊处理，不能用webpack处理，所以需要和gulp配合使用。例如第三方文件。
