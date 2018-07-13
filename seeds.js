var mongoose = require("mongoose");
var Campground = require("./models/campgrounds.js");
var Comment = require("./models/comment.js");

var data = [
	{name: "BOOBIES", image: "https://images.unsplash.com/photo-1526404746352-668ded9b50ab?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3836a89226f34ce6fae379a66f868fbf&auto=format&fit=crop&w=800&q=60", description: "blah blah blah"},
	{name: "Poop Scoot", image: "https://images.unsplash.com/photo-1526404746352-668ded9b50ab?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3836a89226f34ce6fae379a66f868fbf&auto=format&fit=crop&w=800&q=60", description: "blah blah blah"},
	{name: "Dr hoggly wogglies", image: "https://images.unsplash.com/photo-1526404746352-668ded9b50ab?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3836a89226f34ce6fae379a66f868fbf&auto=format&fit=crop&w=800&q=60", description: "blah blah blah"}
];

function seedDB(){
	// remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		} else {
			// add campgrounds
			console.log("REMOVED CAMPGROUNDS");
			data.forEach(function(seed){
				Campground.create(seed, function(err, createdCampground){
					if(err){
						console.log(err);
					} else {
						console.log("SEEDED NEW CAMPGROUND");
						Comment.create(
							{
								text: "Great",
								author: "Homer"
							}, function(err, createdComment){
								if(err){
									console.log(err);
								} else {
									createdCampground.comments.push(createdComment);
									createdCampground.save();
									console.log("SEEDED NEW COMMENT");
								}
							}
						);
					}
				});
			});
		}
	});		

	// add comments
}

module.exports = seedDB;
