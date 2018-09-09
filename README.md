# cordova-devtool-hot-load

## `cordova plugin add cordova-devtool-hot-load`

## cordova开发工具,真机热调试加载插件

* 1、请确保你的手机wifi和你的开发电脑处于同一路由IP段下，并保证你的开发电脑防火墙端口(8080和8282)处于开启状态。

* 2、由于使用的cordova钩子,请使用cordova run命令调试运行,勿用编辑器调试工具,否则工具插件不能正常运行。

* 3、钩子会将入口页面地址修改。在开始生产打包发布前,请删除本插件,并将你的config.xml里的content src="index.html"改回来。

* 4、本工具适合用于非webpack热加载的web项目,如果你的项目是webpack热加载项目,请不要使用本插件.你可以将cordova的js文件拷贝引入到项目里,然后在电脑上运行你的web服务,接着直接修改config.xml的`content src="你的web服务地址"`来运行cordova,远程访问调试。

* 插件原理(cordova钩子开发,cordova运行前更改入口页面地址为局域网开发电脑的ip地址,cordova运行成功后,node开启http服务和websocket服务,并将所有http请求的html和htm页面加入bundle.js钩子的websocket,通过监听文件改变发送websocket告知页面刷新)
