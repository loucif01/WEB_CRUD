var express = require('express');
var passport = require("passport");
var User = require("../models/User");
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.use(flash());

mongoose.connect('mongodb://localhost/bdd',{ useNewUrlParser: true}, function(err,client) {
    if(err){
        console.log(err);
    }
    else {
        console.log('connected to '+ 'mongodb://localhost/bdd');
        
      }
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true) 

var userController = {};

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
 });
});


a='';

 passport.use(new LocalStrategy({
	passReqToCallback : true},
	function(req,username, password, done){
		User.findOne({username: username}, function(err, user){
			if(err) {
				return done(err);
			}
			if(!user){
				return done(null, false, {message: 'Incorrect username'});
			}

			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err) {
					return done(err);
				}
				if(isMatch){					
					a= user.admin ? "Admin" : "User";					
					return done(null, user);
				} else {
					return done(null, false, {message: 'Incorrect password'});
				}
			});
		});
	}
	));
	
	
// Post login

userController.doLogin = passport.authenticate('local',{ successRedirect:'/staff-logged',
                                                         failureRedirect: '/staff',
                                                         failureFlash: 'Invalid Username Or Password' });
											
														 
                                                    
userController.loggedInOnly =function (req, res, next){
  if (req.isAuthenticated()) next();
  else res.redirect('/staff');
};

// logout
userController.logout = function(req, res) {
  	
  req.logout();
  req.flash('success', 'You have logged out');
  res.location('/staff-logged');
  res.redirect('/staff');
};


//CRUD users

//READ users
userController.doRead=function(req, res) {
	User.find({}, function(err, users) {
		var userMap = {};
	
		users.forEach(function(user) {
			userMap[user._id] = user;
		  });
	  
		
	  // console.log(userMap);
		res.render('staff-logged',{"userMap":userMap}); 

	  });

	}	

// CREATE user
userController.doCreate = function(req, res) {
	// Get Form Values
	
	var username 		= req.body.username;
	var password 		= req.body.password;
	var password2 		= req.body.password2;
	var admin           = req.body.admin;
	var companyName 	= req.body.companyName;
    
	// Validation
	/*
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('admin', 'admin field is required').notEmpty();
	req.checkBody('companyName', 'companyName field is required').notEmpty();
*/  

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		console.log('password confirmation error');
		res.render('staff-logged', {
			errors: errors,
			username:username,
			password: password,
			password2: password2,
			admin:admin,     
	        companyName :companyName

		});
	} else {

		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


		var newUser = {
			username:username,
			password: password,
			admin:admin,     
	        companyName :companyName
		}
        
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				newUser.password = hash;

				User.create(newUser, function(err, doc){
					if(err){
						
						res.send(err);
					} else {
						console.log('User Added...');

						//Success Message
						req.flash('success', 'You are registered and can now log in');

						// Redirect after register
						res.location('/staff-logged');
						res.redirect('/staff-logged');
					}
				});
			});
		});

		
	}
};

// READ user
userController.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// UPDATE user
userController.update = (req, res) => {
    pswhash = req.body.password;	
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(pswhash, salt, function(err, hash){
			pswhash = hash;
	
	User.findOne({ username: req.body.username }, function (err, doc){
		doc.password = pswhash;
		doc.admin = req.body.admin;
		doc.companyName = req.body.companyName;
		doc.save();
		console.log("user updated successfully...");
		res.send(doc);
	  });
	 });
});

};
 
// DELETE user
userController.delete = (req, res) => {
    User.findOneAndDelete({_id:req.body._id})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.body._id
            });
		}
		console.log("user deleted successfully!");
		res.send({message: "user deleted successfully!"});
		
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "user not found with id " + req.body._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.body._id
        });
    });
};


module.exports = userController;