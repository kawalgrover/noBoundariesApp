var request = require('request');
var async = require('async');

exports.updateDB = function(logger,db){
    var bitstamp = {
        price : 0,
        change : 0
    };
    var btce = {
        price : 0,
        change : 0,
    };
    var coinbase = {
        price : 0,
        change : 0
    };
    async.parallel([
        function(callback) { 
            request("https://www.bitstamp.net/api/ticker/", function(error, response, data) {
                data = JSON.parse(data);
                //logger.log(data);
                bitstamp.price = data.last;
                bitstamp.change = parseFloat((data.high-data.low)*(100/data.low)).toFixed(2);
                callback();
            });
        },
        function(callback) { 
            request("http://btc.blockr.io/api/v1/coin/info", function(error, response, data) {
                //logger.log(JSON.parse(data));
                coinbase.price = JSON.parse(data).data.markets.coinbase.value;
                coinbase.change = JSON.parse(data).data.markets.coinbase.daily_change.perc;
                btce.price = JSON.parse(data).data.markets.btce.value;
                btce.change = JSON.parse(data).data.markets.btce.daily_change.perc;
                callback();
            });
        }
    ], function(err) {
        if (err){
            logger.log(err);
            return false;
        } else {
            db.btcInfoCollection.findOne({}, {}, function (err, info) {
                if (info){
                    info.refresh(bitstamp,btce,coinbase);
                    info.save(function (err) {
                        if (err)
                            logger.log(err);
                        else
                            logger.log('BTC info updated');
                    });
                } else {
                    newInfo = new db.btcInfoCollection();
                    newInfo.bitstamp.price = bitstamp.price;
                    newInfo.bitstamp.dailyChange = bitstamp.change;
                    newInfo.btce.price = btce.price;
                    newInfo.btce.dailyChange = btce.change;
                    newInfo.coinbase.price = coinbase.price;
                    newInfo.coinbase.dailyChange = coinbase.change;
                    newInfo.save(function (err) {
                        if (err)
                            logger.log(err);
                        else
                            logger.log('BTC info updated');
                    });
                }      
            }); 
        } 
    }); 
  setTimeout(module.updateDB,60000);
}

