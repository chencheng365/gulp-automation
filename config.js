// 存放未编译的文件夹
const ROOT_DEV ='src';
// 存放编译过后的文件夹
const ROOT_BUILD ='build';
// 存放打包后的文件夹    
const ROOT_ZIP ='zip';


module.exports = {
    // 端口号设置
    port: 9090,
    
    // 代理请求设置
    proxyTable: {
        // 代理ip
        target: 'http://0.0.0.1',
        // 代理ip接口名字
        inner: 'inner'
    },

    rootDev: ROOT_DEV,
    rootBuild: ROOT_BUILD,
    rootZip: ROOT_ZIP,

    // 未编译的路径
    dev: {
        html : ROOT_DEV + '/**/*.html',
        css : ROOT_DEV + '/css/**/*.scss',
        js   : ROOT_DEV + '/js/*.js',
		cssLibs : ROOT_DEV + '/css/libs/**',
		jsLibs : ROOT_DEV + '/js/libs/*',
        images: ROOT_DEV + '/images/**/*.{png,jpg,gif,ico}'
    },

    // 编译过后的路径
    build: {
        html : ROOT_BUILD + '',
        css  : ROOT_BUILD + '/css/',
        js   : ROOT_BUILD + '/js/',
		cssLibs : ROOT_BUILD + '/css/libs/',
		jsLibs : ROOT_BUILD + '/js/libs/',
        images: ROOT_BUILD + '/images/'
    }
};

