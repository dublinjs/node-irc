var 	url = "https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=newsycombinator&count=5",
	request = require('request');

exports.listeners = [
	[
		/^.*PRIVMSG\s(#.*)\s:\\hackernews/i,
		function(data, irc) {
			request({uri : url}, function(error, response, body) {
					if (error) {
						irc.msg(data[1], "Error parsing twitter feed");
						return;
					}
					if(response.statusCode == 200){
						jdata = JSON.parse(body);
						var str = ""
						jdata.forEach(function(tweet) {
								str += tweet['text'] + "\n"
							});
						irc.msg(data[1], str)
					}else{
						irc.msg(data[1], "Weird status code: "+response.statusCode);
					}
			});
		}
	]
]
