var irc = require("./irc.js").irc;
 
/*
* Demonstration of overloading a method.
*/
irc._msg= irc.msg;
irc.msg = function(chan, msg) {
	irc.log("Wrote "+msg+" on "+chan)
	return irc._msg(chan, msg)
};
   
irc.init()
