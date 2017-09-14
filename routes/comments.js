var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment")


//COMMENT NEW    
router.get("/new", IsLoggedIn, function (req, res) {

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
router.post("/", IsLoggedIn, function (req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
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
                    console.log(comment);
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
//edit routes
router.get("/:comment_id/edit", function(req, res){
// res.send("hiiiiiiii");
      Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
          res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
       }
  });
    
});

//comment update
router.put("/:comment_id", function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );  
       }
   });
});
//comment destroy route
router.delete("/:comment_id", function(req, res){
Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
        res.redirect("back"); 
    } else {
        res.redirect("/campgrounds/" + req.params.id);
    }
})
});
// MIDDLWARE
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;