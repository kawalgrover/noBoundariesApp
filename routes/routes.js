var express = require('express');
var request = require('request');
var https = require('https');
var router = express.Router();

module.exports = function(logger,db,app,multipartMiddleware){

    var module = {};

    module.addRoutes = function(){
        //Index, partials and directives
        app.get('/', module.index);
        app.get('/home', module.index);
        app.get('/login', module.index);
        app.get('/register', module.index);
        app.get('/partials/:name',module.partials);
        app.get('/directives/:name',module.directives);
        app.get('/mySessions',module.requestNeedAuth, module.mySessions);
        //Sitemap
        app.get('/sitemap.xml', module.sitemap);
    }

    module.index = function(req,res){
        res.render('index.html');
    };

    module.partials = function(req,res){
        res.render('partials/' + req.params.name);
    };

    module.directives = function(req,res){
        res.render('directives/' + req.params.name);
    };

    module.viewNeedAuth = function(req, res, next) {
        if (req.isAuthenticated())
            return next();
        else
            res.redirect('/login');
    }

    module.requestNeedAuth = function(req, res, next) {
        if (req.isAuthenticated)
            return next();
        else
            res.json({success : false, message : "Need to be authenticated"});
    }

    var randomInt = function(){
        return (1/Math.floor(Math.random() * (10000 - 1) + 1)).toFixed(8);;
    }

    var isArray = function (what){
        return Object.prototype.toString.call(what) === '[object Array]';
    }

    module.sitemap = function(req,res){
        var urls = ['index.html'];
        var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        for (var i in urls) {
            xml += '<url>';
            xml += '<loc>http://www.cryptuse.com/' + urls[i] + '</loc>';
            xml += '<changefreq>daily</changefreq>';
            xml += '<priority>0.5</priority>';
            xml += '</url>';
            i++;
        }
        xml += '</urlset>';
        res.header('Content-Type', 'text/xml');
        res.send(xml); 
    }

    module.mySessions = function(req,res){
        res.json(req.user.sessions);
    }

    return module;

}