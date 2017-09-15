var Campground = require("../models/campground");
var Comment = require("../models/comment");


//All middleware goes here
var middlewareObj = {};
middlewareObj.checkCampgroundOwenership = function (req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "campground not found");
                res.redirect("back");
            } else {
                //doew user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "you dont have permission to do that");
                    res.redirect("back");
                }

            }
        });
    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwenership = function (req, res, next) {
    //is use logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //doew user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "you have dont permission to do that");
                    res.redirect("back");
                }

            }
        });
    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back")
    }
}
middlewareObj.IsLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        // console.log(IsLoggedIn);
        return next();
    }
    else {
        // req.flash("message", "login first");
        req.flash("error", "you need to be logged in to do that");
        res.redirect("/login");
    }
}
    
module.exports = middlewareObj;