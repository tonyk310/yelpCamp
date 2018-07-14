var express			= require("express");
var app				= express();
var bodyParser 		= require("body-parser");
var flash 			= require("connect-flash");

var mongoose 		= require("mongoose");
var passport 		= require("passport");
var localStrategy 	= require("passport-local");
var methodOverride	= require("method-override");
var passportLocalMongoose;
var expressSession 	= require("express-session");

var Campground 		= require("./models/campgrounds.js");
var Comment 		= require("./models/comment.js");
var User			= require("./models/user.js");

var seedDB			= require("./seeds.js");

var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes	= require("./routes/comments.js");
var indexRoutes		= require("./routes/index.js");


// $ export DATABASEURL=mongodb://localhost:27017/yelpcamp10
console.log(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost:27017/yelpcamp10");
mongoose.connect(process.env.DATABASEURL || "mongodb://tony:password1@ds235411.mlab.com:35411/yelpcamp");
// mongoose.connect("mongodb://tony:password1@ds235411.mlab.com:35411/yelpcamp");





// tell express to use body-parser
app.use(bodyParser.urlencoded({ extended:true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

// PASSPORT CONFIGURATION

// tell express to use sessions
app.use(expressSession({
	secret: "i pooped",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// connect passport to local strategy
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(resLocals);
// pass req.user to every template
function resLocals(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.flashError = req.flash("error");
	res.locals.flashSuccess = req.flash("success");
	next();
}



// REQUIREING ROUTES
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT || 3000, function(){
	console.log("YelpCamp Server Started");
});