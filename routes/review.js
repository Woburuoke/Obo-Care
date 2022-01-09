
const express = require("express");
const router = express.Router({mergeParams: true});
const Controller = require("../controllers/reviewController");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isReviewAuthor,validateReview } = require("../middleware");


 







router.post("/",isLoggedIn, validateReview, wrapAsync(Controller.createReview))
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(Controller.deleteReview))

module.exports = router;