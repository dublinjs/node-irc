exports.listeners = [
	[
		/^.*PRIVMSG\s(#.*)\s:meetup:(.+)/i,
		function(data, irc) {
			irc.log(data)
			irc.next_meetup = data[2]
			irc.msg(data[1], "Meeting saved")
		}
	],
	[
		/^.*PRIVMSG\s(#.*)\s:nextmeetup/i,
		function(data, irc) {
			irc.log(data)
			irc.next_meetup = irc.next_meetup || "no meeting setup";
			irc.msg(data[1], irc.next_meetup);
		}
	]
]
