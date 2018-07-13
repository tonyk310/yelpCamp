var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds.js");
var middleware = require("../middleware");



// INDEX ROUTE
router.get("/campgrounds", function(req, res){
	// console.log("REQ.USER IS FROM PASSPORT:", req.user);
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			// console.log(allCampgrounds);
			// render the campgrounds page with the campgrounds passed through
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	// res.send("you hit the post route");
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;

	var author = {
		id: req.user._id,
		username: req.user.username
	};
	// get data from form and add to campgrounds array
	newCampground = {name: name, image: image, description: description, author: author, price: price};
	// console.log(newCampground);
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, createdCampground){
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			// console.log(createdCampground);
			req.flash("success", "Campground successfully created!");
			res.redirect("/campgrounds");
		}
	});
});

// NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			// console.log(foundCampground);
			// render the show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}

	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + updatedCampground._id);  //req.params.id
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			req.flash("error", "something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Campground successfully deleted");
			res.redirect("/campgrounds");
		}
	});
});

// MIDDLEWARE

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id, function(err, foundCampground){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next();
// 				} else {
// 					console.log("YOU DO NOT HAVE PERMISSION TO DO THAT");
// 					res.redirect("back");
// 				}
// 			}
// 		});
	

// 	} else {
// 		console.log("YOU MUST BE LOGGED IN TO DO THAT");
// 		res.redirect("/login");
// 	}
// }

module.exports = router;