/*
* This code is based on the code seen here (http://www.w3schools.com/jsref/jsref_regexp_exec.asp)
*/
var net = require('net'),
	fs = require('fs');

exports.irc = {
	"listeners": [],
	"handle": function(data){
		var i, info;
		for (i = 0; i < this.listeners.length; i++)
		{
			//This checks the regex which is the first
			//Will not be false if matches.
			//Those pushed on first will win.
			info = this.listeners[i][0].exec(data);
			if (info)
			{
				this.listeners[i][1](info, data);
				if (this.listeners[i][2])
				{
					this.listeners.splice(i, 1);
				}
			}
		}
	},
	"init": function(filename){
		this.filename = filename || "config.json";
		this.info = JSON.parse(
			fs.readFileSync("config.json"));
		this.socket = new net.Socket();
		//Set up connect callback
		var that = this;
		this.socket.on('connect', function () {
			that.log("Established connection")
			that.on(/^PING\s:(.*)\r/i, function(info){
				that.log(info);
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
		this.socket.setEncoding('ascii');
		this.socket.setNoDelay();
		this.socket.connect(this.info.port, this.info.host);
		this.socket.on('data', function(data) {
			data = data.split('\n');
			data.forEach( function( line ) {
				that.handle( line );
			});
		});
		this.info.mods.forEach( function(mod) {
			var temp_listen = require("./"+mod).listeners;
			temp_listen.forEach(function(listen) {
				that.on(listen[0], listen[1])
			})
		});
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
	"on" : function(data, callback) {
		var that = this;
		if (callback !== undefined) {
			var cb = function (info) {
				return callback(info, that);
			}
		}
		this.listeners.push([data, cb, false])
	},
	"on_once" : function(data, callback) {
		this.listeners.push([data, callback, true])
	},
	"raw" : function(data, callback) {
		var that = this;
		this.socket.write( data + "\n", "ascii", function() {
			that.log('SENT -'+ data)
		});
	},
	"log" : function(msg) {
		console.log(msg)
	}
}
