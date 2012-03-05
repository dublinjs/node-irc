var fs = require('fs');

_load_listeners = function(data, irc) {
	try {
		stats = fs.lstatSync(data[2]);
		if (!(stats.isDirectory())) {
			var temp_listen = require("./../"+data[2]);
			if(temp_listen.listeners){
				return temp_listen.listeners
			}else{
				irc.msg(data[1], "module must export a listeners array");
			}
		}else{
			irc.msg(data[1], "That module is a directory");
		}
	}catch(e) {
		irc.msg(data[1], "The module "+data[2]+" does not exist" + e);
	}
	return null; 
}

exports.listeners = [
	[
		/^.*PRIVMSG\s(#.*)\s:\\load\s(.+)\r/i,
		function(data, irc) {
			var listeners = _load_listeners(data, irc);
			if(listeners == null)
				return;
			console.log("Here");
			listeners.forEach(function(listen){
						try{
							irc.on(listen[0], listen[1], data[2]);
							irc.msg(data[1], "module "+data[2]+" load success.");
						}catch(e) {
							irc.msg(data[1],
								"Some problem occurred loading listeners.");
						}
			});
		}
	],
	[
	/^.*PRIVMSG\s(#.*)\s:\\unload\s(.+)\r/i,
	function(data, irc) {
		if(irc.listeners.hasOwnProperty(data[2])){
			for (var i=0;i < irc.listeners[data[2]].length;i++) {
				irc.listeners[data[2]][i][2] = true
			}
			irc.msg(data[1], "module "+data[2]+" unload success.")
		}else{
			irc.msg(data[1], "module "+data[2]+" unload failure.")
			console.log(irc.listeners)
		}
	}
]
]
