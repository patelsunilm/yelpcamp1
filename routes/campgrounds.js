var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function (req, res) {
    //GET ALL CAMPGROUND DB
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds });
        }
    });
});
router.post("/", IsLoggedIn, function (req, res) {
    //GET DATA FROM FROM AND TO CAMPGROUND ARRY
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = { name: name, image: image, description: desc, author: author }
    //console.log(req.user);
    // create a new campbackground and save to db    
    Campground.create(newcampground, function (err, newlycreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds  page
            console.log(newlycreated);
            res.redirect("/campgrounds");
        }
    });
});
//SHOW FORM TO A CREATE NEW CAMP GROUND
router.get("/new", IsLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
//show more info about one campground
router.get("/:id", function (req, res) {
    //find the camground with provide id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundcampground);
            //render show template with the campground 
            res.render("campgrounds/show", { campground: foundcampground });
        }
    });

});
//EDIT  CAMGROUNDS ROUTES
router.get("/:id/edit", checkCampgroundOwenership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});
router.put("/:id", function (req, res) {
    //find and update the corret campground 
    //var data = {name: req.body.name, image: req.body.image}
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete campgrounds
router.delete("/:id", function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//MIDDLEWARE
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwenership(req,res,next) {

    //is use logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                //doew user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }

            }
        });
    } else {

        res.redirect("back")
    }
}
module.exports = router;