/*
* This code is based on the code seen here (http://www.w3schools.com/jsref/jsref_regexp_exec.asp)
*
*/

var irc = require("./irc.js").irc;
 
/*
* Demonstration of overloading a method.
*/
irc._msg= irc.msg;
irc.msg = function(chan, msg) {
	console.log("Wrote "+msg+" on "+chan)
	return irc._msg(chan, msg)
};
   
irc.init()
