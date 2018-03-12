/**
 * gulp 自动化构建工具
 * gulpfile.js 配置文件
 * 
 */
var fs            = require('fs');
var path          = require('path');
var gulp          = require('gulp');
var notify        = require('gulp-notify'); // 加控制台文字描述用的
var sass          = require('gulp-sass'); // sass的编译
var autoprefixer  = require('gulp-autoprefixer'); // css浏览器前缀补全
var minifycss     = require('gulp-minify-css'); // 压缩css
var del           = require('del'); // 删除文件
var gulpif        = require('gulp-if'); // 条件判断
var minimist      = require('minimist'); //获取命令行中的env参数
var gulpSequence  = require('gulp-sequence'); // 顺序执行

var imagemin      = require('gulp-imagemin'); // 图片压缩
var pngquant      = require('imagemin-pngquant'); // 图片无损压缩(深度压缩图片)

var uglify        = require('gulp-uglify'); // 压缩js代码
var plumber       = require('gulp-plumber'); // 阻止 gulp 插件发生错误导致进程退出并输出错误日志
var gutil         = require('gulp-util'); // 打印日志 log

var htmlmin       = require('gulp-htmlmin'); // 压缩html

var watch         = require('gulp-watch'); //监听文件变化
//var	rev 		  = require('gulp-rev-append');
var	rev 		  = require('gulp-rev');
var	replace 	  = require('gulp-rev-replace');
var changed       = require('gulp-changed'); //只重新编译被更改过的文件
var debug       = require('gulp-debug');
// 静态服务器和代理请求
var url           = require('url');
var proxy         = require('proxy-middleware'); //代理中间件，转发。解决跨域
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;

// 代理请求 / 端口设置 / 编译路径
var config = require('./config.js');

//默认development环境--区分开发(development)和生产(production)环境
var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

/**
 * 开发环境和生产环境
 * 先清空原先文件夹，在执行编译或者打包
 * 
 * @param {any} cb 回调
 */
var cnEnvironment = function(cb) {
   // 先执行清空文件夹内容
   del(config.rootBuild).then(paths => {
        // 通知信息
        gutil.log(gutil.colors.green('Message：Delete complete!'));
        gutil.log(gutil.colors.green('Message：Deleted files and folders:', paths.join('\n')));
        
        // 执行项目打包
        gulpSequence([
            'htmlmin', 'cssmin', 'images', 'jsmin', 'copycssLibs', 'copyjsLibs'
        ], function() {
            gutil.log(gutil.colors.green('Message：Compile finished!'));
            // 执行回调
            cb &&　cb();
        });
    });	
}



/* 编译css */
gulp.task('cssmin', function () {
    var AUTOPREFIXER_BROWSERS = [
        'last 2 version',
        'ie >= 6',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.0'
    ];
    return gulp
		.src(config.dev.css)
        .pipe(changed(config.build.css,{extension:'.css'}))
		.pipe(plumber())
        .pipe(sass())
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(gulpif(options.env === 'production', minifycss()))
        .pipe(gulp.dest(config.build.css))
		.pipe(reload({ stream: true }))
		
});



/* 复制引用第三方资源目录css/libs */
gulp.task('copycssLibs', function() {
    return gulp
		.src(config.dev.cssLibs)
        .pipe(gulp.dest(config.build.cssLibs))
		.pipe(reload({ stream: true }))
});
// CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('md5-rev', () => {
  return gulp
    .src(['build/css/**/*.css'],{ base: 'build' })
    .pipe(rev())
	.pipe(gulp.dest('build/dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('build/temp'));
});
// Html替换css文件版本
gulp.task('md5-replace', () => {
  var manifest = gulp.src('build/temp/rev-manifest.json');
  return gulp.src(config.dev.html, { base: './' })
    .pipe(replace({
      manifest: manifest,
      replaceInExtensions: ['.html'], // 只能替换这些类型的文件中的新文件名
      prefix: '/test/', //将前缀字符串添加到每个替换
      modifyReved: replaceJsIfMap
    }))
    .pipe(gulp.dest('build/'));
});
// 处理成 "../css/default.css?v=5a636d79c4" 这样的格式
function replaceJsIfMap(filename) {
	console.log(filename)
	//var index = filename.lastIndexOf(".");  
	var before = filename.replace(/(.*)\-{1}.*/, '$1');
	var after = filename.substring(filename.lastIndexOf(".") + 1, filename.length); 
	var has = (filename.substring(filename.lastIndexOf("-") + 1, filename.length)).split('.')[0];
	return before + "." +after + "?v=" + has;
}

gulp.task('minifyjsmd5', function() {
    return gulp
		.src([config.build.css,config.build.js],{ base: 'build' })
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest('build/dist'))
        .pipe(rev.manifest()) //生成一个rev-manifest.json
        .pipe(gulp.dest('build/temp')); //将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('addv', ['md5-replace', 'minifyjsmd5']);

/* images 压缩 */
gulp.task('images', () => {
    return gulp
        .src(config.dev.images)
        .pipe(changed(config.build.images))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        
        .pipe(gulp.dest(config.build.images))
		.pipe(reload({ stream: true }))
		
});


/* js 压缩 */
gulp.task('jsmin',function() {	
    return gulp
		.src([config.dev.js, '!node_modules/**'])
        .pipe(changed(config.build.js))
        .pipe(plumber())
		.pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
        .pipe(gulp.dest(config.build.js))
		.pipe(reload({ stream: true }))
})
/* 复制引用第三方资源目录js/libs */
gulp.task('copyjsLibs', function() {
    return gulp
		.src(config.dev.jsLibs)
        .pipe(gulp.dest(config.build.jsLibs))
		.pipe(reload({ stream: true }))
});


/* html 打包*/
gulp.task('htmlmin', function() {
    var optionsSet = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    };
	return gulp
	.src(config.dev.html)
    .pipe(changed(config.build.html))
	.pipe(plumber())
	.pipe(gulpif(options.env === 'production', htmlmin(optionsSet)))
	// .pipe(debug({title: "--编译js--"}))
	.pipe(rev())
    .pipe(gulp.dest(config.build.html))
	.pipe(reload({ stream: true }))
});



// 看守src目录下所有文件的变化（增删改）
gulp.task('watchChange', function(){
    watch(config.rootDev)
        .on('add', handleFile)
        .on('change', handleFile)
        .on('unlink', function(file){
            var newPath = file.replace('\\src\\', '\\build\\');
            if(newPath.indexOf(".scss")!=-1){
                newPath = newPath.replace('scss', 'css');
            }
            fs.unlink(newPath, function(err){
                gutil.log(gutil.colors.red('deleteFile-->'+newPath+err));
				reload();
            });            
        });
});

// 不同文件变化执行不同任务
function handleFile(file){
	gutil.log(gutil.colors.green('handleFile-->'+file));
    if(file.indexOf(".scss")!=-1){
        gulp.start('cssmin');
    }else if(file.indexOf(".css")!=-1){
        copyFile(file);
    }else if(file.indexOf("images")!=-1){
       gulp.start('images');
    }else if(file.indexOf("js")!=-1 && file.indexOf("libs")==-1){
       gulp.start('jsmin');
    }else if(file.indexOf("js")!=-1 && file.indexOf("libs")!=-1){
	   copyFile(file);
    }else if(file.indexOf(".html")!=-1){
       gulp.start('htmlmin');
    }    
}

//拷贝文件
function copyFile(file){
    var newPath = file.replace('\\src\\', '\\build\\');
    var readStream = fs.createReadStream(file);
    var writeStream = fs.createWriteStream(newPath);
    readStream.pipe(writeStream);
	//browserSync.reload();
	reload();
}

/* server 服务器 */
gulp.task('server', function() {

   cnEnvironment(function(){
        gutil.log(gutil.colors.green('启动本地服务器'));
        gutil.log(gutil.colors.green('代理请求地址：' + config.proxyTable.target));
        gutil.log(gutil.colors.green('代理请求项目：' + config.proxyTable.inner));

        var proxyOptions = url.parse(config.proxyTable.target + config.proxyTable.inner);
        proxyOptions.route = config.proxyTable.inner;

        browserSync.init({ // 初始化 BrowserSync
            injectChanges: true, // 插入更改
            files: [
                '*.html', '*.css', '*.js'
            ], // 监听文件类型来自动刷新
            server: {
                baseDir: config.rootBuild, // 目录位置
				index: 'index.html', // 指定默认打开的文件
                middleware: [proxy(proxyOptions)] // 代理设置
            },
            ghostMode: { // 是否开启多端同步
                click: true, // 同步点击
                scroll: true // 同步滚动
            },
            logPrefix: 'browserSync in gulp', // 再控制台打印前缀
            browser: ["chrome"], //运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
            open: true, //       自动打开浏览器
            port: config.port   // 使用端口
        });

        // 监听watch
        gulp.start('watchChange');
    });

});

/* build 打包项目 */
gulp.task('build', function() {
    cnEnvironment(function(){
		gutil.log(gutil.colors.green('Message：Project package is complete'));
    })
});

/* 任务命令 */
gulp.task('default', function() {
    gutil.log(gutil.colors.green('开发环境：npm run dev 或者 gulp server'));
    gutil.log(gutil.colors.green('打包项目：npm run build 或者 gulp build --env production'));
});
