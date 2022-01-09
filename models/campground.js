const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true} };

const campgroundSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
     geometry: {
         type: {
             type: String,
             enum: ["Point"],
             required: true
         },
         coordinates: {
             type: [Number],
             required: true
         }
     },
    images: [ImageSchema],
    price : {
        type : Number,
         
    },
    description : {
        type : String
    },
    location : {
        type : String,
         
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
},opts);


campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

campgroundSchema.post("findOneAndDelete", async function(dcampground) {
    if(dcampground){
        await Review.deleteMany({
            _id: {
                $in: dcampground.reviews
            }
        })
    }

})

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground