var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

var keys = {
    'facebook' : {
        'clientID'      : '1476459875938682', 
        'clientSecret'  : '5b19539325791b68501a561a9c148cf2', 
        'callbackURL'   : 'http://localhost:3010/auth/facebook/callback'
    },
    'twitter' : {
        'consumerKey'       : 'cZOtjJf7Ze1HtYzMN30iBtVDg',
        'consumerSecret'    : 'SN98rqpFmJQKFzVsE6Y9MIy004jj086n4bwyYMzlRjwqE6sWgA',
        'callbackURL'       : 'http://localhost:3006/auth/twitter/callback'
    },
    'google' : {
        'clientID'      : '163346236403-ujs3p4q6gdm1nolvru9alu2jtqgqs922.apps.googleusercontent.com',
        'clientSecret'  : 'vOLbMIuUEVSl2VcbGnDbg8mB',
        'callbackURL'   : 'http://localhost:3006/auth/google/callback'
    }
};

module.exports = function(passport,db,app,session,flash) {

    app.use(session({ secret: 'seedApp666'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash()); 

    app.post('/logUser', passport.authenticate('local-login', {
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true 
    }));

    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
    app.get('/auth/twitter/callback', 
        passport.authenticate('twitter', {
            successRedirect : '/home',
            failureRedirect : '/login'
        })
    );

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/home',
            failureRedirect : '/login'
        })
    );

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/login'
        })
    );
    app.post('/logout',function(req, res) {
        req.user.online = false;
        req.user.save();
        req.logout();
        res.redirect('/');
    });

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        db.usersCollection.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {
        console.log("login local");
        process.nextTick(function() {
            if (req.user){
                console.log(req.user);
                req.logout();
            }
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
            if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(username)){
                username.toLowerCase();
                db.usersCollection.findOne({'mail.mail' : username, password : password}, {}, function (err, user) {
                    if (err){
                        return done(null, false, req.flash('loginMessage', 'Error.'));
                    } else{
                        if (!user){
                            return done(null, false, req.flash('loginMessage', 'Error.'));
                        }else{
                            if (!user.mail.activated){
                                return done(null, false, req.flash('loginMessage', 'Error.'));
                            } else {
                                user.loginLocal(ip);
                                user.save(function (err) {
                                    if(err) {
                                        return done(null, false, req.flash('loginMessage', 'Error.'));
                                    } else {
                                        return done(null, user, req.flash('loginMessage', 'Success.'));
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                db.usersCollection.findOne({username : username, password : password}, {}, function (err, user) {
                    if (err){
                        return done(null, false, req.flash('loginMessage', 'Error.'));
                    } else{
                        if (!user){
                            return done(null, false, req.flash('loginMessage', 'Error.'));
                        }else{
                            if (!user.mail.activated){
                                return done(null, false, req.flash('loginMessage', 'Error.'));
                            } else {
                                user.loginLocal(ip);
                                user.save(function (err) {
                                    if(err) {
                                        return done(null, false, req.flash('loginMessage', 'Error.'));
                                    } else {
                                        return done(null, user, req.flash('loginMessage', 'Success.'));
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    }));

    passport.use(new FacebookStrategy({
        clientID        : keys.facebook.clientID,
        clientSecret    : keys.facebook.clientSecret,
        callbackURL     : keys.facebook.callbackURL,
        passReqToCallback : true 
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
            if (!req.user) {
                db.usersCollection.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    else if ((user) && (!user.facebook.token)) {
                        user.logInFB(ip,profile.name.givenName + ' ' + profile.name.familyName,(profile.emails[0].value || '').toLowerCase(),token);
                        user.save(function(err) {
                            if (err)
                                return done(err);
                            else
                                return done(null, user);
                        });
                    } else {
                        return done(null, user);
                    } 
                });
            } else {
                // Link account
                var user = req.user; 
                user.linkFB(profile.idprofile.name.givenName + ' ' + profile.name.familyName,(profile.emails[0].value || '').toLowerCase(),token);
                user.save(function(err) {
                    if (err)
                        return done(err);
                    else    
                        return done(null, user);
                });
            }
        });
    }));

    passport.use(new TwitterStrategy({
        consumerKey     : keys.twitter.consumerKey,
        consumerSecret  : keys.twitter.consumerSecret,
        callbackURL     : keys.twitter.callbackURL,
        passReqToCallback : true
    },
    function(req, token, tokenSecret, profile, done) {
        process.nextTick(function() {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
            if (!req.user) {
                db.usersCollection.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    else if ((user) && (!user.twitter.token)) {
                        user.logInTW(ip,profile.displayName,profile.username,token);
                        user.save(function(err) {
                            if (err)
                                return done(err);
                            else 
                                return done(null, user);
                        });
                    } else {
                        return done(null, user);
                    }
                });
            } else {
                // Link account
                var user = req.user;
                user.linkTW(profile.id,profile.displayName,profile.username,token);
                user.save(function(err) {
                    if (err)
                        return done(err);
                    else
                        return done(null, user);
                });
            }
        });
    }));

    passport.use(new GoogleStrategy({
        clientID        : keys.google.clientID,
        clientSecret    : keys.google.clientSecret,
        callbackURL     : keys.google.callbackURL,
        passReqToCallback : true 
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
            if (!req.user) {
                db.usersCollection.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    else if ((user) && (!user.google.token)) {
                        user.logInGG(ip,profile.displayName,(profile.emails[0].value || '').toLowerCase(),token)
                        user.save(function(err) {
                            if (err)
                                return done(err);
                            else
                                return done(null, user);
                        });
                    } 
                });
            } else {
                // Link account
                var user = req.user;
                user.linkGG(profile.id,profile.displayName,(profile.emails[0].value || '').toLowerCase(),token)
                user.save(function(err) {
                    if (err)
                        return done(err);
                    else
                        return done(null, user);
                });
            }
        });
    }));
};


