/*
* This code is based on the code seen here (http://webdevrefinery.com/forums/topic/8762-writing-a-very-simple-irc-bot-in-nodejs/)
*/
var net = require('net'),
	fs = require('fs');

_keys = function(dict) {
	var keys = []
	for (var key in dict)
		if(dict.hasOwnProperty(key))
			keys.push(key)
	return keys;
};


exports.irc = {
	"listeners": {},
	"events": {},
	"handle": function(data){
		var i, info,
			keys = _keys(this.listeners);
	
		for (i = 0; i < keys.length; i++)
		{
			//For each key
			var key = keys[i];
			//This checks the regex which is the first
			//Will not be false if matches.
			//Those pushed on first will win.
			this.listeners[key].forEach(function (listener) {
				info = listener[0].exec(data);
				if (info)
				{
					listener[1](info, data);
				}
			})
			this.listeners[key] = this.listeners[key].filter(function(listener) {
				return ! listener[2];
			});
		}
	},
	"interval_setup": function(module_name, func, interval) {
		var that = this;
		var new_func = function() {
			return func(that);
		}
		this.events["module_name"] = []
		this.events["module_name"].push(
			setInterval(
				new_func,
				interval * 1000
			)
		);
	},
	"init": function(filename){
		this.load(filename);
		this.socket = new net.Socket();
		//Set up connect callback
		var that = this;
		this.socket.on('connect', function () {
			that.log("Established connection")
			that.on(/^PING\s:(.*)\r/i, function(info){
				that.raw('PONG :' + info[1]);
			});
			setTimeout(function() {
				that.raw('NICK '+that.info.nick);
				that.raw('USER '+that.info.nick+' 8 * '+that.info.real_name);
				setTimeout( function() {
					that.join(that.info.channel);
				}, 500);
			}, 500);
		});
		// Set up interval in which to run events
		this.socket.setEncoding('ascii');
		this.socket.setNoDelay();
		this.socket.connect(this.info.port, this.info.host);
		this.socket.on('data', function(data) {
			data = data.split('\n');
			data.forEach( function( line ) {
				that.handle( line );
			});
		});
		this.load_mods()
	},
	"load_mods" : function() {
		var that = this;
		this.info.mods.forEach( function(mod) {
			var mod_obj = require("./"+mod)
			var temp_listen = mod_obj.listeners;
			if(temp_listen) {
				temp_listen.forEach(function(listen) {
					that.on(listen[0], listen[1], mod)
				})
			}
			var mod_events = mod_obj.events;
			if(mod_events){
				that.interval_setup(
					mod,
					mod_events[0],
					mod_events[1]
				)
			}
		});
	},
	"load" : function(filename) {
		this.filename = filename || "config.json";
		this.info = JSON.parse(
			fs.readFileSync("config.json"));
	},
	"join" : function(chan, callback) {
		if (callback !== undefined) {
			this.on_once(new RegExp('^:' + this.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
		}
		this.info.names[chan] = {};
		this.raw('JOIN '+ chan);
	},
	"msg" : function(chan, msg) {
		var max_length, msg, interval;
		max_length = 500 - chan.length;

		msgs =  msg.match(new RegExp('.{1,' + max_length + '}', 'g'));
		var that=this;
		interval = setInterval(function(){
			that.raw('PRIVMSG ' + chan + ' :' + msgs[0]);
			msgs.splice(0, 1);
			if (msgs.length === 0)
			{
				clearInterval(interval);
			}
		}, 1000);
	},
	"on" : function(data, callback, key) {
		var that = this;
		key = key || "general";
		if (callback !== undefined) {
			var cb = function (info) {
				return callback(info, that);
			}
		}
		if(!(this.listeners.hasOwnProperty(key)))
			this.listeners[key] = []
		this.listeners[key].push([data, cb, false])
	},
	"on_once" : function(data, callback, key) {
		key = key || "general";
		if(!(this.listeners.hasOwnProperty(key)))
			this.listeners[key] = []
		this.listeners[key].push([data, callback, true])
	},
	"raw" : function(data) {
		var that = this;
		this.socket.write( data + "\n", "ascii", function() {
			that.log('SENT -'+ data)
		});
	},
	"log" : function(msg) {
		console.log(msg)
	}
}
