var mongoose = require("mongoose");
// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String, 
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author : {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	price: Number
});

var Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground;