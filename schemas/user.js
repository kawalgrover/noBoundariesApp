var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(db) {
	var user = new Schema( {
	    online : Boolean,
	    username : String,
	    name : String,
	    birthDate : String,
	    gender : String,
	    registerDate : Date,
	    sessions : [String],
	    mail : {
            mail : String,
            emailkey : String,
            activated : Boolean
            },
	    socialNetworks : {
	        facebook : {
		        id : String,
		        token : String,
		        email : String,
		        name : String
		    },
		    twitter : {
		        id : String,
		        token : String,
		        displayName : String,
		        username : String
		    },
		    google : {
		        id : String,
		        token : String,
		        email : String,
		        name : String
		    }
	    },
	    password : String,
	    ban : Boolean,
	    banReason : String,
	    deleted : Boolean,
	    passwordKey : String
	});

	user.methods.create = function () {
        this.online = false;
        this.name = '';
        this.username = '';
        this.password = '';
        this.birthDate = '';
        this.gender = '';
        this.registerDate = null;
        this.deleted = false;
       	this.newsletter = false,
	    this.notifications = false,
        this.ban = false;
        this.banReason = '';
        this.sessions = [];
        this.mail = {
            mail : '',
           	emailkey : '',
            activated : false
        };
        this.socialNetworks = {
            facebook : {},
            twitter : {},
            google : {}
        };
	}

	user.methods.signInFB = function(id,name,email,token){
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
		this.socialNetworks.facebook.name = name;
		this.socialNetworks.facebook.email = email;
		this.socialNetworks.facebook.token = token;
	}
	user.methods.signInTW = function(id,displayName,username,token){
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
		this.socialNetworks.twitter.displayName = displayName;
		this.socialNetworks.twitter.username = username;
		this.socialNetworks.twitter.token = token;
	}
	user.methods.signInGG = function(id,name,email,token){
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
        this.lastIP = ip;
		this.socialNetworks.google.name = name;
		this.socialNetworks.google.email = email;
		this.socialNetworks.google.token = token;
	}

	user.methods.logInFB = function(name,email,token){
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
		this.socialNetworks.facebook.name = name;
		this.socialNetworks.facebook.email = email;
		this.socialNetworks.facebook.token = token;
	}
	user.methods.logInTW = function(displayName,username,token){
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
		this.socialNetworks.twitter.displayName = displayName;
		this.socialNetworks.twitter.username = username;
		this.socialNetworks.twitter.token = token;
	}
	user.methods.logInGG = function(name,email,token){
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
		this.socialNetworks.google.name = name;
		this.socialNetworks.google.email = email;
		this.socialNetworks.google.token = token;
	}

	//Link social network
	user.methods.linkFB = function(id,name,email,token){
		this.socialNetworks.facebook.id = id;
		this.socialNetworks.facebook.name = name;
		this.socialNetworks.facebook.email = email;
		this.socialNetworks.facebook.token = token;
	}
	user.methods.linkTW = function(id,displayName,username,token){
		this.socialNetworks.twitter.id = id;
		this.socialNetworks.twitter.displayName = displayName;
		this.socialNetworks.twitter.username = username;
		this.socialNetworks.twitter.token = token;
	}
	user.methods.linkGG = function(id,name,email,token){
		this.socialNetworks.google.id = id;
		this.socialNetworks.google.name = name;
		this.socialNetworks.google.email = email;
		this.socialNetworks.google.token = token;
	}

	//LogOut
	user.methods.LogOut = function(){
		this.online = false;
		this.socialNetworks.google.token = null;
		this.socialNetworks.twitter.token = null;
		this.socialNetworks.facebook.token = null;
	}

	var generateToken = function(lenght){
	    var token = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < lenght; i++ )
	        token += possible.charAt(Math.floor(Math.random() * possible.length));
	    return token;
	}

	//USERS COLLECTION
	db.users = db.model('users', user);
}