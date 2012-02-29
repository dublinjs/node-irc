var fs = require('fs');

exports.listeners = [
	[
		/^.*PRIVMSG\s(#.*)\s:\\load\s(.+)\r/i,
		function(data, irc) {
			try {
				stats = fs.lstatSync(data[2]);
				if (!(stats.isDirectory())) {
					var temp_listen = require("./../"+data[2]);
					if(temp_listen.listeners){
						temp_listen.listeners.forEach(function(listen){
								try{
									irc.on(listen[0], listen[1]);
									irc.msg(data[1], "module "+data[2]+" load success.");
								}catch(e) {
									irc.msg(data[1],
									       	"Some problem occurred loading listeners.");
								}
						});
					}else{
						irc.msg(data[1], "module must export a listeners array");
					}
				}else{
					irc.msg(data[1], "That module is a directory");
				}
			}catch(e) {
				irc.msg(data[1], "The module "+data[2]+" does not exist" + e);
			}
		}
	]
]
