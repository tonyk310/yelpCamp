var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

// COMMENTS NEW
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

// COMMENTS CREATE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	// lookup campground by :id
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("");
		} else {
			// create new comment
			Comment.create(req.body.comment, function(err, createdComment){
				if(err){
					console.log(err);
					req.flash("error", "Something went wrong");
				} else {
					// add username and id to comment
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					// save comment
					createdComment.save();
					// connect new comment to campground
					foundCampground.comments.push(createdComment);
					foundCampground.save();
					// redirect to show page
					// console.log(createdComment);
					req.flash("success", "Comment successfully created!");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

// EDIT COMMENT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	// first find the campground
	// then find the comment associated with the campground

	// then render the edit form and pass through two arguments
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			// you have found the correct campground now look for the comment
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err || !foundComment){
					console.log(err);
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground: foundCampground, comment: foundComment});
				}
			});
		}
	});
});

// UPDATE COMMENT ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	// Campground.findById(req.params.id, function(err, foundCampground){
	// 	if(err){
	// 		console.log(err);
	// 	} else {
			Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
				if(err){
					console.log(err);
				} else {
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		// }
// 	});
});

// DELETE COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			return console.log(err);
		}
		req.flash("success", "You have successfully removed the comment");
		res.redirect("/campgrounds/" + req.params.id);
	});
});

// MIDDLEWARE

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 						// that comes from passport once they are logged in.
// 		var userId = req.user._id;
// 		console.log(userId);

// 		// comepare the userId to the is of the author of the comment 
// 		// and if they are the same we grant permission
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if (foundComment.author.id.equals(userId)){
// 				next();
// 			} else {
// 				console.log('YOU DO NOT HAVE PERMISSION TO DO THAT');
// 				res.redirect("back");
// 			}
// 		});
// 	} else {
// 		console.log('YOU MUST BE LOGGED IN TO DO THAT');
// 		res.redirect("/login");
// 	}
// }

module.exports = router;