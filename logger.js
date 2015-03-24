/************************************ Logger ************************************/
var colors = require('colors');

function loggerManager(envarioment){
	this.env = envarioment;
}
loggerManager.prototype.setEnv = function(envarioment) {
	if (envarioment == "dev"){
		this.env = "dev";
	}
}
loggerManager.prototype.log = function(message){
	console.log(message);
}
loggerManager.prototype.warning = function(message){
	console.log(message.yellow);
}
loggerManager.prototype.success = function(message){
	console.log(message.green);
}
loggerManager.prototype.error = function(message){
	console.log(message.red);
}
loggerManager.prototype.important = function(message){
	console.log(message.black.bgWhite);
}
loggerManager.prototype.funny = function(message){
	console.log(message.magenta);
}

module.exports = loggerManager;