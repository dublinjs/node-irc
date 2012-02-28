exports.listeners = [
	[
		// e.g :richdel!richdel@cube.netsoc.tcd.ie JOIN #testexample
		/:(.+)!(.+)\sJOIN\s(.+)\r$/i,
		function(data, irc) {
			if(data[1] == irc.info.nick)
				return
			irc.welcome_msg = irc.welcome_msg || "Welcome!"
			irc.msg(data[3], irc.welcome_msg+" "+ data[1])
		}
	],
	[
		/^.*PRIVMSG\s(#.*)\s:welcomemessage:(.+)/i,
		function(data, irc) {
			irc.welcome_msg = data[2]
		}
	]
]
