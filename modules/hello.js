exports.listeners = [
	[
		/^.*PRIVMSG\s(#.*)\s:morning/i,
		function(data, irc) {
			irc.log(data)
			irc.msg(data[1], "Morning")
		}
	]
]
