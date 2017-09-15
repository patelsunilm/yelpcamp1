var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//COMMENT NEW    
router.get("/new", middleware.IsLoggedIn, function(req, res) {

    //find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }

    });

});
// Comment create 
router.post("/", middleware.IsLoggedIn, function (req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if(err) {
                    req.flash("error", "somthing went worng");
                    console.log(err);
                } else {
                    // console.log(req.user._id);
                    //add username and id comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // console.log("new comments  username well be:" + req.user.username)
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                  //  console.log(comment);
                    req.flash("success", "success fully add comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
//edit routes
router.get("/:comment_id/edit",middleware.checkCommentOwenership, function (req, res) {
    // res.send("hiiiiiiii");
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });

});

//comment update
router.put("/:comment_id", middleware.checkCommentOwenership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwenership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;