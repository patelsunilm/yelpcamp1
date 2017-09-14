var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");

//root route    
router.get("/", function (req, res) {
    res.render("landing");
});
//show register from    
router.get("/register", function (req, res) {
    res.render("register");
});
//handel sign up logic
router.post("/register", function (req, res) {
    //res.send("signing yor form");
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds")
        });
    });
});
//show login  from
router.get("/login", function (req, res) {
    res.render("login");
}); 
//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {

    });
//logout logic 
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});
//middlware 
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;