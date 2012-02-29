exports.listeners = [
	[
		/^.*PRIVMSG\s(#.*)\s:(.+)/i,
		function(data, irc) {
			irc.log(data)
		}
	]
]
