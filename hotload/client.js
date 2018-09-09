const fs = require('fs');
const path = require('path');
const os = require('os');

function patchTargetPlatform(context, platform)
{
	var addr = getServerAddr();
	fs.readFile(path.join(context.opts.projectRoot,'config.xml'),'UTF-8',function(err,data){
		if(err){
			console.error(err);return;
		}
		fs.writeFile(path.join(context.opts.projectRoot,'config.xml'),data.replace('src="index.html"','src="http://'+addr.address+':8686/index.html"'),'UTF-8',function(err,data){
			if(err){
				console.error(err);return;
			}
		});
	});
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

module.exports = function(context)
{
  if (context.opts.platforms.indexOf('android') >= 0) {
    patchTargetPlatform(context, 'android');
  }
  if (context.opts.platforms.indexOf('ios') >= 0) {
    patchTargetPlatform(context, 'ios');
  }
}