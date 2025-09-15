const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedin, isReviewauthor} = require("../middleware.js");
const  reviewController = require("../controllers/reviews.js");



//post reviews
router.post("/", isLoggedin,validateReview, wrapAsync(reviewController.postReview));


//Delete Recview rOUT
router.delete("/:reviewId",isLoggedin,isReviewauthor,wrapAsync(reviewController.destroyReview));

module.exports =router;