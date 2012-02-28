Node IRC-BOT
------------

##Introduction##

This is a [NodeJS](http://nodejs.org/) IRC bot, which was made for the #dublinjs irc channel but should work for any channel and any irc network, particularly those which are free access for all.

##Parts of the code##

###bot.js###
* This is what you run.
* You can override some of the irc _methods_ here if you feel like it.
* the irc bot is run by doing irc.init()

###irc.js###
* This is where all the irc logic lives.
* It is an object which has the following properties(so far)
	* *init*: 
		- loads config file
		- connects to irc.
		- loads modules.
		- sets up some handles.
	* *handle*: this gets a message and allows each of the listeners to execute if their regex matches.
	* *on/on_once*:
		- These define a way to callback on a certain data.
		- I have overwritten the callback so that it passes in the irc object.
	* *raw*:
		- Write a raw message to the socket.
		- Useful if you want to do some irc command, such as JOIN, LEAVE etc.
	* *msg*:
		- A useful method to send a message to the channel.
		- splits it up and sends to channel.
		- Please see Accreditation
	* *log*:
		- Log something
		- overload this to log somewhere diff.

###modules/###
* Place your modules in this directory.
* A module consists of a file which exports at least something called listeners which is an array of objects.
* These objects should consist of a regex object and a callback function

##Making your own module##
* Make your own module file like those defined in modules/
* Add it to the config file under the modules properties.
* Re-run the bot (Hopefully I will remove this step in time.)

##Some Resources worth a look##

[The site where a lot of the irc code came from.](http://webdevrefinery.com/forums/topic/8762-writing-a-very-simple-irc-bot-in-nodejs/)
[Wikipedia IRC commands page.](http://en.wikipedia.org/wiki/List_of_Internet_Relay_Chat_commands)
