var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(db) {

	var btcInfo = new Schema({
		bitstamp:{
			price : Number,
			dailyChange : Number
			},
		btce:{
			price : Number,
			dailyChange : Number
			},
		coinbase:{
			price : Number,
			dailyChange : Number
		}
	});
	
	btcInfo.methods.refresh = function(bitstamp,btce,coinbase){
		this.bitstamp.price = bitstamp.price;
		this.bitstamp.dailyChange = bitstamp.change;
		this.btce.price = btce.price;
		this.btce.dailyChange = btce.change;
		this.coinbase.price = coinbase.price;
		this.coinbase.dailyChange = coinbase.change;
	}
	
	db.btcInfoCollection = db.model('btcInfoCollection', btcInfo);
};
