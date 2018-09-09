const fs = require('fs');
const path = require('path');
const server = require('node-http-server');
const WebSocket = require('ws');
const os = require('os');
let wsg,wss;
let lastUpdateTime = 0;
let bundle = 'var ws=new WebSocket("ws://localhost:8282");ws.onopen=function(){console.log("bundle success");};ws.onmessage=function(evt){if(evt.data == "changed"){location.reload();}};ws.onclose=function(){console.log("bundle closed");};';

function patchTargetPlatform(context, platform)
{
	var addr = getServerAddr();
	console.log("\n-----------------------------------\n\nget hot server address: "+addr.address+" \n\nplease makesure the IP of your test mobile in the same IP router \n\n-----------------------------------\n\n");
	var platformPath = path.join(context.opts.projectRoot, 'platforms', platform);
	var platformAPI = require(path.join(platformPath, 'cordova', 'Api'));
	var platformAPIInstance = new platformAPI();
	var wwwPath = platformAPIInstance.locations.www;
	fs.writeFileSync(path.join(wwwPath,'bundle.js'),bundle.replace('localhost',addr.address),'UTF-8');
	webserver(wwwPath + '/');
}

module.exports = function(context)
{
  if (context.opts.platforms.indexOf('android') >= 0) {
    patchTargetPlatform(context, 'android');
  }
  if (context.opts.platforms.indexOf('ios') >= 0) {
    patchTargetPlatform(context, 'ios');
  }
}

function webserver(root){
	let webroot = root;
	server.onRequest = function(request,response,serve){
		var pathname = request.uri.pathname;
		if(pathname[pathname.length-1] == '/'){
			pathname += 'index.html';
		}
		var parr = pathname.split('.');
		var result = '<script src="/bundle.js"></script>';
		if(['htm','html'].includes(parr[parr.length-1])){
			fs.readFile(webroot + pathname.substr(1),'UTF-8',function(err,data){
				if(err){
					result = JSON.stringify(err);
				}else{
					result += data;
				}
				serve(
					request,
					response,
					result
				);
			});
			return true;
		}else{
			return false;
		}
	}

	server.deploy(
		{
			port:8080,
			root:webroot
		},
		function(){
			console.log('hot load web server start success, Do not close this command !');
		}
	);
	
	wss = new WebSocket.Server({ port: 8282 });
	 
	wss.on('connection', function connection(ws) {
		
	  ws.on('message', function incoming(message) {
		  
	  });
	  
	  ws.on('close', function(){
		  
	  });
	  
	});
	
	watchwebs(webroot);
}

function watchwebs(dir) {
  fs.watch(dir, (event, filename,dd)=> {
    var diff = Date.now() - lastUpdateTime
    lastUpdateTime = Date.now()
    if (diff < 100) return
	  wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
		  client.send('changed');
		}
	  });
  })

  // 原生监控不能监控到子文件夹中的文件改变事件，遍历之
  var files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; i++) {
    var file = dir + '/' + files[i]
    var stat = fs.statSync(file)
    if (stat.isDirectory() == true) {
      watchwebs(file);
    }
  }
}

function getServerAddr(){
    let local
    let networkInterfaces = os.networkInterfaces()
    let reg = new RegExp(/^192./)
    for (var n in networkInterfaces) {
      if (reg.test(networkInterfaces[n][1]['address'])) {
        local = networkInterfaces[n][1]
      }
    }
    return local
}