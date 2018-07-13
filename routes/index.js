var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");

// ROOT ROUTE
router.get("/", function(req, res){
	res.render("landing");
});

// REGISTER FORM ROUTE
router.get("/register", function(req, res){
	res.render("register.ejs");
});

// REGISTER LOGIC ROUTE
router.post("/register", function(req, res){
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, newUser){
		if(err){
			console.log("ERROR:::", err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + newUser.username);  //or req.user.username
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN ROUTE
router.get("/login", checkAlreadyLoggedIn, function(req, res){
	res.render("login.ejs");
});

// HANDLES LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	successFlash: "Log in successful",
	failureFlash: true
}), function(req, res){});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have sucessfully logged out!");
	res.redirect("/campgrounds");
});

function checkAlreadyLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		
		console.log("you are already logged in");
		req.flash("error", "you are already logged in");
		res.redirect("back");
	} else {
		next();
	}
}


module.exports = router;