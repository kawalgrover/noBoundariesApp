var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(db) {

	var eventSchema = new Schema({
			title : {
	        type: String,
	        required: true
	    },
	    subTitle : {
	        type: String
	    },
	    description : {
	        type: String,
	        required: true
	    },
	    from : {
	        type: Date,
	        required: true
	    },
	    to : {
	        type: Date,
	        required: true
	    },
	    offeredBy : {
	        type: String
	    },
	    location : {
	        address1: {type: String, required: true},
	        address2: {type: String},
	        city: {type: String, required: true},
	        state: {type: String},
	        zip: {type: String}
    	}
	});
	
	eventSchema.methods.change = function(){
	}
	eventSchema.methods.fill = function(){
	}
	
	db.events = db.model('events', eventSchema);
};
