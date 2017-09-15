var express       = require("express"),
    app           = express(),
    bodyparser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash");
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride= require("method-override");
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
//requring routes 
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")   
   
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyparser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
global.basepath = __dirname;
//seed the database
//seedDB();

//passport configurtton
app.use(require("express-session")({
    secret: "rusty is win in the game",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
     next();
});

app.use("/", indexRoutes );
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes );

app.listen(4000, function () {
    console.log("server stared......4000");
}); 