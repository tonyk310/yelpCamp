// ALL THE MIDDLEWARE GOES HERE

var Campground = require("../models/campgrounds.js");
var Comment = require("../models/comment.js");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				console.log(err);
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					console.log("YOU DO NOT HAVE PERMISSION TO DO THAT");
					req.flash("error", "You do not have permission to do that!");
					res.redirect("back");
				}
			}
		});
	

	} else {
		console.log("YOU MUST BE LOGGED IN TO DO THAT");
		req.flash("error", "You must be logged in to do that!");
		res.redirect("/login");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
						// that comes from passport once they are logged in.
		var userId = req.user._id;
		// console.log(userId);

		// comepare the userId to the is of the author of the comment 
		// and if they are the same we grant permission
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				console.log(err);
				req.flash("error", "comment not found");
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(userId)){
					next();
				} else {
					console.log('YOU DO NOT HAVE PERMISSION TO DO THAT');
					req.flash("error", "You do not have permission to do that!");
					res.redirect("back");
				}				
			}

		});
	} else {
		console.log('YOU MUST BE LOGGED IN TO DO THAT');
		req.flash("error", "You must be logged in to do that!");
		res.redirect("/login");
	}
};


middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You must be logged in to do that!");
	res.redirect("/login");	
};


module.exports = middlewareObj;