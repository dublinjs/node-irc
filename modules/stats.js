var fs = require("fs");

exports.listeners = [
	[
		/^:(.*)\!.*\sPRIVMSG\s(#.*)\s:(.+)/i,
		function(data, irc) {
			var name = data[1];
			if(name == irc.info.nick)
				return;
			var channel = data[2];
			var msg =  data[3];
			if(msg.indexOf("blabbermouths") != -1)
				return 
			if(irc.store === undefined)
				irc.store = {}
			if(name in irc.store){
				irc.store[name]++;
			}else {
				irc.store[name] = 1;
			}
		}
	],
	[
		/^.*PRIVMSG\s(#.*)\s:\\blabbermouths\s*\r$/i,
		function(data, irc) {
			var channel = data[1];
			if(!(irc.store))
				return
			resp = "";
			for(var name in irc.store){
				if(irc.store.hasOwnProperty(name)){
					resp += name + ": "+ irc.store[name] + "\n";
				}
			}
			if(resp == "")
				return
			irc.msg(channel, resp);
		}
	]
]

exports.events = [
	function(irc) {
		if(irc.store) {
			var file = fs.open("logs.json", "w",
						function(err, fd) {
							var store = JSON.stringify(
									irc.store
									)
							fs.write(fd,
								store
							);
						});
		}else{
			fs.readFile("logs.json",  
					function(err, data) {
						if(err){
							console.log(err);
							return;
						}
						irc.store = JSON.parse(data);
					})
			irc.log("No store, get more chatty");
		}
	},
	300
]
