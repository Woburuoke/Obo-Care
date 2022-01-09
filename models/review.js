const mongoose = require("mongoose");
const User = require("./user")

const reviewSchema = new mongoose.Schema({
    body : {
        type : String,
         
    },
     
    rating : {
        type : Number,
         
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

    
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review