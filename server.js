/////////////////////////////////////// Module dependencies ///////////////////////////////////////
var express = require('express');
var session = require('express-session');
var helmet = require('helmet');
var favicon = require('serve-favicon');
var path = require('path');
var multipart = require('connect-multiparty');
//Parsers
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Mailer
var mailer = require('express-mailer');
//Request and Async
var request = require('request');
var async = require('async');
//HTTP Auth
var basicAuth = require('basic-auth-connect');
// Mongo
var mongo = require('mongodb');
var mongoose = require('mongoose');
//Bitcore
var bitcore = require("bitcore");
//Passport
var passport = require('passport')
var flash = require('connect-flash');

/////////////////////////////////////// Server Conf ///////////////////////////////////////

//Get Arguments
var args = process.argv.slice(2);
var port = process.env.PORT;
//Logger
var loggerManager = require('./logger');
var logger = new loggerManager(args[0]);
//Launch express
var app = express();
//Multipart for image encryption
var multipartMiddleware = multipart();
//If is a dev session or no
if (args[0] == 'dev'){
    var port = 3010;
} else {
    //Auth
    app.use(basicAuth('worldwide', 'reach666'));
}
// Config Envarioment
app.set('port', port || process.env.PORT);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon(__dirname + '/public/img/seed.ico'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());  
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/////////////////////////////////////// DATABASE ///////////////////////////////////////

mongoose.connect('mongodb://127.0.0.1:27017/noboundaries');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('Connected to NoBoundaries DB !');
    require('./update').updateDB(logger,db);
});

/////////////////////////////////////// MAILER ///////////////////////////////////////

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'contact@prvider.com',
    pass: 'pass'
  }
});

/////////////////////////////////////// SCHEMAS ///////////////////////////////////////

require('./schemas/user')(db);
require('./schemas/btcinfo')(db);

/////////////////////////////////////// REQUEST AND RESPONSE ///////////////////////////////////////

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/////////////////////////////////////// PASSPORT AND AUTH ///////////////////////////////////////

require('./routes/passport')(passport,db,app,session,flash);

/////////////////////////////////////// ROUTES ///////////////////////////////////////

require('./routes/routes')(logger,db,app,multipartMiddleware).addRoutes();

/////////////////////////////////////// 404 ///////////////////////////////////////

app.all('*',function(req,res) { res.redirect('/error404') });

/////////////////////////////////////// START SERVER ///////////////////////////////////////

app.listen(app.get('port'), function() {
    if (app.get('port') == 3010)
        logger.important('Welcome Dev! - Node server started on LOCALHOST at port: '+app.get('port'));
    else
        logger.important('Node server started on '+Date(Date.now())+' at port: '+app.get('port'));
})
