var mongoose = require("mongoose");
var campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "karna",
        image: "http://www.sanctuaryretreats.com/media/4993647/rates-hero.jpg",
        description: "New England is a northeastern region of the United States comprising the states of Maine, Vermont, New Hampshire, Massachusetts, Connecticut and Rhode Island. It's known for its Colonial past, Atlantic coastline, changing autumn foliage and forested mountains. Boston, Massachusetts, "
    },
    {
        name: "sunil",
        image: "http://www.sanctuaryretreats.com/media/5112484/about-the-camp-hero-3.jpg",
        description: "New England is a northeastern region of the United States comprising the states of Maine, Vermont, New Hampshire, Massachusetts, Connecticut and Rhode Island. It's known for its Colonial past, Atlantic coastline, changing autumn foliage and forested mountains. Boston, Massachusetts, "
    },
    {
        name: "sajag",
        image: "http://www.sanctuaryretreats.com/media/4993647/rates-hero.jpg",
        description: "New England is a northeastern region of the United States comprising the states of Maine, Vermont, New Hampshire, Massachusetts, Connecticut and Rhode Island. It's known for its Colonial past, Atlantic coastline, changing autumn foliage and forested mountains. Boston, Massachusetts, "
    }
]
function seedDB() {
    //remove all campground 
    campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campground");

        //add few campground
        data.forEach(function (seed) {
           campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //add few comments
                    Comment.create(
                        {
                            text:"this is great",
                            author: "sunil"
                         },function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("create a new comment")
                            }
                            
                         });
                }
            });
        });

    });

    
}
module.exports = seedDB;
