var express = require('express');
var router = new express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

// GET users listing. 
router.get("/", ensureAuthenticated, function(req, res, next) {
  res.render("index", { title: "Home" });
});

router.get("/register", ensureAuthenticated, function(req, res, next) {
    res.render("register", {
      title: 'Nuovo Utente'
  });
});

/*
router.get("/register", function(req, res, next) {
  res.render("register", {
      'title': 'Nuovo Utente'
  });
});
*/

router.get("/login", function(req, res, next) {
  res.render("login", {
      'title': 'Login'
  });
});


router.post("/register", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var password2 =  req.body.password2;

    // Form Validation
    req.checkBody('username','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);

    // Check for errors
    var errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            username: username,
            password: password,
        });

            // Create User
            User.createUser(newUser, function(err, user){
                if(err)throw err;
                console.log(user);
            });

            //Success Message
            req.flash('success', 'Nuovo utente registrato');

            res.location('../');
            res.redirect('../');
    }
});




passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(username, password, done){
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                console.log('Unknown User');
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

router.post("/login", passport.authenticate('local',{failureRedirect: "/users/login", failureFlash: 'Invalid username or password'}), function(req, res){
    console.log('Authentication Successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect("/users/login");
});

module.exports = router;