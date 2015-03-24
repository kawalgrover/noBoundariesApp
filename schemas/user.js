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
        this.sessionToken= '';
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

	//Register
	user.methods.register = function(online,username,password,birthDate,mail,emailkey){
		this.online = online;
        this.username = username;
        this.password = password;
        this.birthDate = birthDate;
        this.lastLogin = new Date();
        this.registerDate = new Date();
        this.deleted = false;
        this.subscribed = true;
        this.ban = false;
        this.rate = 0;
        this.mail.mail = mail;
        this.mail.emailkey = generateToken(6);
	};

	//LogIn
	user.methods.loginLocal = function(ip){
		this.sessionToken = generateToken(6);
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
        this.lastIP = ip;
	}
	user.methods.logInFB = function(ip,name,email,token){
		this.sessionToken = generateToken(6);
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
        this.lastIP = ip;
		this.socialNetworks.facebook.name = name;
		this.socialNetworks.facebook.email = email;
		this.socialNetworks.facebook.token = token;
	}
	user.methods.logInTW = function(ip,displayName,username,token){
		this.sessionToken = generateToken(6);
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
        this.lastIP = ip;
		this.socialNetworks.twitter.displayName = displayName;
		this.socialNetworks.twitter.username = username;
		this.socialNetworks.twitter.token = token;
	}
	user.methods.logInGG = function(ip,name,email,token){
		this.sessionToken = generateToken(6);
        this.lastLogin = new Date();
        this.lastAction = new Date();
        this.online = true;
        this.lastIP = ip;
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
		this.sessionToken = null;
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
	db.usersCollection = db.model('userscollection', user);
}