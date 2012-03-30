var timeout = 30;

exports.events = [
	function(irc) {
		irc.log("This event was called every "+timeout+"seconds")
	},
	timeout
]
