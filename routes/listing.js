const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin,isOwner,validateList} = require("../expressMiddleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage });


//JOI---------------------------------------------------------



    router
        .route("/")
        .get(wrapAsync(listingController.index))
        .post(isLoggedin,upload.single('listing[image]'),validateList, wrapAsync(listingController.createListing));
     //NEW ROUTE

    router.get("/new",isLoggedin,listingController.renderNewForm);

    router
        .route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedin,isOwner,upload.single('listing[image]'),validateList, wrapAsync(listingController.updateListing))
        .delete(isLoggedin, isOwner,wrapAsync(listingController.DeleteListing));



        
    //Edit Rout
    router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.rendereditListing));

    module.exports= router;
