# 使用gulp进行es6+版本号自动添加+热更新开发
## 使用


1、进入目录 打开命令  输入 npm i 进行安装（如果装了yarn，直接yarn,效率会更高）

2、安装后需要，修改一下版本号插件文件（进行一次即可，下文有说明）

3、输入命令 gulp 进行热更新开发

     页面自动打开后是一个空页面，原因是我们把热启动的根目录设置成了dist 如果要打开某个页面实时开发更新，请在浏览器上指向相应的目录即可，
     例如：http://localhost:2017/view/index.html，然后你每次修改文件他都会及时刷新。


4、输入命令 gulp build 进行打包


（注：如果不需要搭建es6环境，仅仅需要一份普通的gulp配置环境的话，只需要在gulpfile.js配置文件中的第270行注释掉即可）


## 项目目录

> gulpfile.js //gulp 配置文件
> package.json //插件包配置文件
> dist //用命令gulp build打包后生成的文件
>> css
>>>base.css
index.css
│  │      
│  ├─js
│  │  ├─config
│  │  │      env.js
│  │  │      fetch.js
│  │  │      mUtisl.js
│  │  │      
│  │  ├─lib
│  │  │      lib.js
│  │  │      
│  │  └─pages
│  │          index.js
│  │          other.js
│  │          
│  └─view
│          index.html
│          test.html
│          
├─node_modules  //npm i  下载下来的插件包
│  
│          
├─rev  //生成的版本hash文件
│  ├─css
│  │      rev-manifest.json
│  │      
│  └─js
│          rev-manifest.json
│          
└─src // 开发环境下的文件目录，请在这里进行开发
    ├─css   //样式
    │      base.less
    │      index.less
    │      
    ├─images //图片
    ├─js   //js
    │  ├─config  //配置文件
    │  │      env.js
    │  │      fetch.js
    │  │      mUtisl.js
    │  │      
    │  ├─lib  //自己编写的类
    │  │      lib.js
    │  │      
    │  ├─pages //相应的页面中js
    │  │      index.js
    │  │      other.js
    │  │      
    │  └─plugins //下载下来的js插件，例如jq等等
    └─view  //模板存放的地址
            index.html
            test.html


以上配置，都参考了如下文章，请自行进行查阅，gulpfile.js也有详细的配置讲解

## 使用gulp 进行ES6开发：参考地址
https://segmentfault.com/a/1190000004394726

## gulp 热更新：参考地址
https://blog.csdn.net/beverley__/article/details/55213235

## 使用Gulp和Browserify创建多个绑定文件
https://www.cnblogs.com/darrenji/p/5492293.html


## 版本号插件修改方法

### 参考地址 http://www.jb51.net/article/100652.htm（gulp自动修改版本号）、https://www.cnblogs.com/tnnyang/p/6023475.html

因为下载下来的包，版本可能有所不一样的，所以修改的地方也有可能不同，但是你可以抓住关键的词进行修改，我的这个版本修改如下。

打开node_modules\gulp-rev\index.js


第135行 manifest[originalFile] = revisionedFile;


更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;






打开nodemodules\gulp-rev\nodemodules\rev-path\index.js//如果找不到这个目录就打开nodemodules\rev-path\index.js


第9行 return modifyFilename(pth, (filename, ext) => `${filename}-${hash}${ext}`);


更新为: return modifyFilename(pth, (filename, ext) => `${filename}${ext}`);







打开node_modules\gulp-rev-collector\index.js


40 行 var cleanReplacement =  path.basename(json[key]).replace(new RegExp(revSuffix )


更新为: var cleanReplacement =  path.basename(json[key]).split('?')[0];



第172行 regexp: new RegExp( '([\/\\\\\'"])' + pattern, 'g' ),


更新为: regexp: new RegExp( '([\/\\\\\'"])' + pattern+'(\\?v=\\w{10})?', 'g' ),






打开node_modules\gulp-assets-rev\index.js


78行 var verStr = (options.verConnecter || "-") + md5;


更新为：var verStr = (options.verConnecter || "") + md5;


80行 src = src.replace(verStr, '').replace(/(\.[^\.]+)$/, verStr + "$1");


更新为：src=src+"?v="+verStr;


