exports.listeners = [
	[
		/:morning/i,
		function(data, irc) {
			irc.msg(irc.info.channel, "Morning")
		}
	]
]
