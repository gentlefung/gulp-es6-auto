var gulp = require('gulp'),
    less = require('gulp-less'),
    assetRev = require('gulp-asset-rev'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    clean = require('gulp-clean'),
    pump = require('pump'),
    changed = require('gulp-changed'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require("browser-sync").create(),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    glob = require('glob'),
    es = require('event-stream'),
    babel = require('gulp-babel'),
    browserify = require('browserify');
/*
    添加版本号的主要思路是

     css添加版本号：
    在src目录下把less文件编译成css，压缩，发布到dist目录下。然后给dist目录下真正生成的css文件添加hash值。生成的hash文件在rev目录下一一对应
    最后使用revHtml，html文件里面的引入的css添加版本号
   
    js添加版本号：

    1、在src目录下把js文件 压缩，es6转换，发布到dist目录下。

    2、然后利用browserify将解析后的ES5代码合并，转变成可供浏览器识别的import、exprot,之类的方式。其中pages的js文件是通过识别各种import、export最终生成合并后的js.

    （如果我们使用了ES6中的 module，通过 import、export 进行模块化开发，那么通过babel转码后， import 、 export 将被转码成符合CMD规范的 require 和 exports 等，但是浏览器还是不认识，这时可以使用 bowserify 对代码再次进行构建）

    3、最后给dist目录下真正生成的js文件添加hash值。生成的hash文件在rev目录下一一对应
    最后使用revHtml，html文件里面的引入的js添加版本号

    */



//定义css、js源文件路径
var lessSrc = 'src/css/*.less',
    cssMinSrc = 'dist/css/*.css',
    jsSrc = 'src/js/*.js',
    jsMinSrc = 'dist/js/*.js',
    //imgMinSrc = 'dist/images/*.{png,jpg,jpeg,gif,ico}',    //这是导致无法给图片添加版本号时所用的路径
    imgSrc = 'src/images/*.{png,jpg,jpeg,gif,ico}', //这是修改后的路径
    htmlSrc = 'src/view/*.html';


/**
   处理css
**/

gulp.task('less', function() {
    return gulp.src(lessSrc) //该任务针对的文件
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        // 编译less
        .pipe(less()) //该任务调用的模块
        .pipe(minifyCss({
            compatibility: 'ie7'
        })) //压缩css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false
        }))
        .pipe(gulp.dest('dist/css')) //编译后的路径
        .pipe(browserSync.reload({
            stream: true
        }));
});

//为css文件中引入的图片/字体等添加hash编码
gulp.task('assetRev', function() {
    return gulp.src('dist/css/*.css') //该任务针对的文件
        .pipe(assetRev()) //该任务调用的模块
        .pipe(gulp.dest('dist/css')); //为css中引入的图片/字体等添加hash编码后的路径
});


//CSS生成文件hash编码并生成rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    return gulp.src('dist/css/*.css')
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});



/**
   处理js
**/


// 压缩 js 文件
gulp.task('uglify', function() {
    // 1 找到文件
    return gulp.src('src/js/**/*.js')
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        // 生成sourcemaps
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // 2 转换es6为es5
        .pipe(babel({
            presets: ['es2015']
        }))
        // 3 压缩文件
        .pipe(uglify({
            mangle: false
        }))
        // 结束sourcemaps
        .pipe(sourcemaps.write())
        //4 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
})


// 将 转化成es6,编译可以供浏览器使用的js,这里主要遍历了pages页面下的js文件。因为所有的这里的js是最终使用的实际使用的js
gulp.task('browser', function(done) {
    // glob为遍历文件函数
    glob('dist/js/pages/*.js', function(err, files) {
        if (err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({
                    entries: [entry]
                })
                
                .bundle()
                .pipe(source(entry))
                .pipe(changed('dist', {
                    hasChanged: changed.compareSha1Digest
                }))
                // .pipe(rename({
                //  extname: '.bundle.js'
                // }))
                // 这的目录是相对于‘dist/js/pages/*.js’
                .pipe(gulp.dest(''))
                .pipe(browserSync.reload({
                    stream: true
                }))
        });
        es.merge(tasks).on('end', done);
    })
});


//js生成文件hash编码并生成rev-manifest.json文件名对照映射 目录结构为dist/js/index.js
gulp.task('revJs', function() {
    return gulp.src(jsMinSrc)
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


//js生成文件hash编码并生成rev-manifest.json文件名对照映射 目录结构为dist/js/lib/lib.js
gulp.task('revJs2', function() {
    return gulp.src('dist/js/**/*.js')
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});



/**
   处理图片
**/
gulp.task('imageMin', function() {
    gulp.src('src/images/*.{png,jpg,jpeg,gif,ico}')
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});



/**
   处理html，压缩
**/
gulp.task('htmlMin', function() {
    var options = {
        collapseWhitespace: true, //从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大。
        collapseBooleanAttributes: true, //省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>。
        removeComments: true, //清除html中注释的部分，我们应该减少html页面中的注释。
        removeEmptyAttributes: true, //清除所有的空属性。
        removeScriptTypeAttributes: true, //清除所有script标签中的type="text/javascript"属性。
        removeStyleLinkTypeAttributes: true, //清楚所有Link标签上的type属性。
        minifyJS: true, //压缩html中的javascript代码。
        minifyCSS: true //压缩html中的css代码。
    };
    return gulp.src(htmlSrc)
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/view'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


//Html替换css、js文件版本,这是
gulp.task('revHtml', function() {
    return gulp.src(['rev/**/*.json', 'dist/view/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist/view'));
});


/**
   删除任务
**/

gulp.task('clean', function(cb) {
    pump([
        gulp.src('dist'),
        clean()
    ], cb)
})


// 打包到真的项目中去
gulp.task('build', function(done) {
    //condition = false;
    runSequence( //此处不能用gulp.run这个最大限度并行(异步)执行的方法，要用到runSequence这个串行方法(顺序执行)才可以在运行gulp后顺序执行这些任务并在html中加入版本号
        'clean',
        'less',
        'assetRev',
        'revCss',
        'uglify',
        'browser',//如果不需要es6环境的开发，直接注释这行就可以，js文件可以按照不是es6开发编写
        'revJs',
        'revJs2',
        'imageMin',
        'htmlMin',
        'revHtml',
        done);
});


// 配置给热更新用，防止过多任务，卡死

gulp.task('dev', function(done) {
    //condition = false;
    runSequence( //此处不能用gulp.run这个最大限度并行(异步)执行的方法，要用到runSequence这个串行方法(顺序执行)才可以在运行gulp后顺序执行这些任务并在html中加入版本号
        'less',
        'uglify',
        'imageMin',
        'htmlMin',
        done);
});

/*
热更新
给每个任务开头添加
 .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
结尾添加

 .pipe(browserSync.reload({
            stream: true
        }));


然后启动下面  serve任务
*/
gulp.task('serve', function() {
    gulp.start('dev');
    browserSync.init({
        port: 2017,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('src/js/*.js', ['dev']); //监控文件变化，自动更新  
    gulp.watch('src/css/*.less', ['dev']);
    gulp.watch('src/view/*.html', ['dev']);
    gulp.watch('src/images/*.*', ['dev']);
});


gulp.task('default', ['serve']);